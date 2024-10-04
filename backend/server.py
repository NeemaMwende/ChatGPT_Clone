from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS to allow cross-origin requests from React

# Read API key from environment variable
API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = API_KEY

# MySQL configuration from .env
app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_DB'] = os.getenv("MYSQL_DATABASE")  # Make sure this database exists
mysql = MySQL(app)

# Initialize Bcrypt and Flask-Login
app.secret_key = os.getenv("SECRET_KEY")  # Set a secret key for session management
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
        return User(user[0])  # Assuming user ID is the first column
    return None

@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    email = request.json['email']  # New field
    password = request.json['password']
    confirm_password = request.json['confirm_password']  # New field

    # Check if the passwords match
    if password != confirm_password:
        return jsonify({'message': 'Passwords do not match'}), 400

    # Hash the password
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

    if user and bcrypt.check_password_hash(user[2], password):  # user[2] is the hashed password
        login_user(User(user[0]))  # user[0] is the user id
        return jsonify({'message': 'Login successful'}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

@app.route('/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logout successful'}), 200

# Route to handle OpenAI chat
@app.route('/chat', methods=['POST'])
@login_required  # Protect the chat route with authentication
def chat():
    data = request.json
    user_message = data.get('message')
    
    # Get response from OpenAI
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": user_message}
        ]
    )

    # Extract assistant's response
    assistant_response = response['choices'][0]['message']['content'].strip()
    
    # Return the response as JSON
    return jsonify({"response": assistant_response})

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)
