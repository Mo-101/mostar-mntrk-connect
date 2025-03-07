from flask import Flask, jsonify, request
import requests
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# LM Studio API URL
LM_STUDIO_URL = "http://172.23.192.1:1234/v1/completions"
MODEL_NAME = "deepseek-r1-distill-qwen-7b"

app = Flask(__name__)

def process_llm_request(prompt, max_tokens=150):
    """Send request to LM Studio and return response."""
    try:
        logger.info(f"Processing LLM request with model: {MODEL_NAME}")
        
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "max_tokens": max_tokens
        }
        
        response = requests.post(LM_STUDIO_URL, json=payload)
        response.raise_for_status()
        
        data = response.json()
        
        if "choices" in data and len(data["choices"]) > 0:
            result = data["choices"][0]["text"].strip()
            logger.info(f"Generated response: {result}")
            return {"response": result}
        else:
            return {"error": "No response from model"}, 500
    
    except requests.exceptions.RequestException as e:
        logger.exception("Error contacting LM Studio")
        return {"error": f"LM Studio request failed: {str(e)}"}, 500

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint for interacting with LM Studio."""
    logger.info("Received request to /chat")
    
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    data = request.get_json()
    logger.info(f"Request data: {data}")
    
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    result = process_llm_request(data['prompt'])
    if isinstance(result, tuple):  # Error case
        return jsonify(result[0]), result[1]
    return jsonify(result)

@app.route('/test', methods=['POST'])
def test():
    """Test endpoint"""
    return jsonify({"message": "Test endpoint working"})

if __name__ == '__main__':
    print("\nStarting server on http://localhost:5000")
    print("\nAvailable routes:")
    print("  POST /test  - Test endpoint")
    print("  POST /chat  - Chat endpoint")
    
    app.run(host='localhost', port=5000)
