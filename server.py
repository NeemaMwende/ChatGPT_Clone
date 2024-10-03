from flask import Flask, request, jsonify
import openai
import os
from dotenv import load_dotenv
from flask_cors import CORS

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Read API key from environment variable
API_KEY = os.getenv("OPENAI_API_KEY")
openai.api_key = API_KEY

# Route to handle OpenAI chat
@app.route('/chat', methods=['POST'])
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
