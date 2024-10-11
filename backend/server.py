import os
import openai
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")

# MySQL configuration from .env
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DATABASE")
mysql = MySQL(app)

# Initialize Bcrypt and Flask-Login
app.secret_key = os.getenv("SECRET_KEY")
bcrypt = Bcrypt(app)
login_manager = LoginManager()
login_manager.init_app(app)

class User(UserMixin):
    def __init__(self, id):
        self.id = id

@login_manager.user_loader
def load_user(user_id):
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        return User(user[0])
    return None

@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    email = request.json['email']
    password = request.json['password']
    confirm_password = request.json['confirm_password']

    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    cursor = mysql.connection.cursor()
    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)", (username, email, hashed_password))
        mysql.connection.commit()
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    finally:
        cursor.close()

    return jsonify({'message': 'Registration successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    cursor.close()

    if user and bcrypt.check_password_hash(user[3], password):  # Adjust index for password
        login_user(User(user[0]))
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/chat', methods=['POST'])
@login_required
def chat():
    message = request.json.get('message')
    if message:
        try:
            openai_response = generate_openai_response(message)
            return jsonify(openai_response)
        except Exception as e:
            return jsonify({'error': f"Failed to generate response from OpenAI: {str(e)}"}), 500
    return jsonify({'error': 'Invalid request method'}), 400

def generate_openai_response(message):
    try:
        openai_response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an AI Assistant created to act as a mental health assistant."},
                {"role": "user", "content": message}
            ],
            max_tokens=150,
            temperature=0.5
        )
        return {'text': openai_response.choices[0].message['content'].strip()}
    except Exception as e:
        return {'error': str(e)}

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
