from flask import Flask, jsonify, request
import logging
import requests

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

LM_STUDIO_API_URL = "http://172.23.192.1:1234/v1/completions"
MODEL_NAME = "deepseek-r1-distill-qwen-7b"  # Change this if using another model

def process_llm_request(prompt):
    """Process LLM request using LM Studio API"""
    try:
        logger.info(f"Processing LLM request with model: {MODEL_NAME}")
        
        # Define the request payload
        payload = {
            "model": MODEL_NAME,
            "prompt": prompt,
            "max_tokens": 150
        }
        
        headers = {"Content-Type": "application/json"}
        
        # Send request to LM Studio
        response = requests.post(LM_STUDIO_API_URL, json=payload, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"Error from LM Studio: {response.text}")
            return {"error": "LM Studio error", "details": response.text}, response.status_code
        
        result = response.json()
        generated_text = result.get("choices", [{}])[0].get("text", "").strip()
        
        logger.info(f"Generated response: {generated_text}")
        return {"response": generated_text}
        
    except Exception as e:
        logger.exception("Error in process_llm_request")
        return {"error": str(e)}, 500

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.info("Received request to /chat")
    
    # Validate JSON
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    # Get JSON data
    try:
        data = request.get_json()
        logger.info(f"Request data: {data}")
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON format"}), 400
    
    # Validate prompt field
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    # Process request
    result = process_llm_request(data['prompt'])
    if isinstance(result, tuple):  # Error case
        return jsonify(result[0]), result[1]
    return jsonify(result)

@app.route('/test', methods=['POST'])
def test():
    """Test endpoint"""
    return jsonify({"message": "Test endpoint working"})

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found"
    }), 404

if __name__ == '__main__':
    print("\nStarting server on http://localhost:5000")
    print("\nAvailable routes:")
    print("  POST /test  - Test endpoint")
    print("  POST /chat  - Chat endpoint")
    
    # Print registered routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    app.run(host='localhost', port=5000, debug=True)
