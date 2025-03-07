from flask import Flask, jsonify, request
import os
import openai
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/gpt4', methods=['POST'])
def gpt4():
    try:
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        logger.info(f"Received data: {data}")
        
        if 'prompt' not in data:
            logger.error("Missing prompt field")
            return jsonify({"error": "Missing prompt field"}), 400
            
        prompt = data['prompt']
        logger.info(f"Processing prompt: {prompt}")
        
        # Initialize OpenAI client
        client = openai.OpenAI()
        
        # Make API call
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant specializing in Mastomys tracking and analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=150
        )
        
        result = response.choices[0].message.content
        logger.info(f"Generated response: {result}")
        
        return jsonify({
            "response": result
        }), 200
            
    except Exception as e:
        logger.error(f"Error in gpt4 endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(port=8081, debug=True)
