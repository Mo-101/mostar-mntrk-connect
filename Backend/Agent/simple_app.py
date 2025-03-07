from flask import Flask, jsonify, request
import os
import openai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/gpt3', methods=['POST'])
def gpt3():
    try:
        if not request.is_json:
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        if 'prompt' not in data:
            return jsonify({"error": "Missing prompt field"}), 400
            
        # Return a test response for now
        return jsonify({
            "response": "Test response - GPT-3 endpoint is working"
        }), 200
            
    except Exception as e:
        app.logger.error(f"Error in gpt3 endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8081, debug=True)
