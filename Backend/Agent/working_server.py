from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    """Simple test endpoint"""
    logger.info("Received request to /test")
    return jsonify({"message": "Hello, world!"})

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint that echoes back the prompt"""
    logger.info("Received request to /chat")
    logger.info(f"Headers: {dict(request.headers)}")
    
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Request must be JSON"}), 400
        
    try:
        data = request.get_json()
        logger.info(f"Received data: {data}")
        
        if 'prompt' not in data:
            logger.error("Missing prompt field")
            return jsonify({"error": "Missing prompt field"}), 400
            
        response = {
            "response": f"You said: {data['prompt']}"
        }
        logger.info(f"Sending response: {response}")
        return jsonify(response)
        
    except Exception as e:
        logger.exception("Error processing request")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting server on http://127.0.0.1:5000")
    logger.info("Available routes:")
    logger.info("  POST /test - Simple test endpoint")
    logger.info("  POST /chat - Chat endpoint that echoes the prompt")
    app.run(host='127.0.0.1', port=5000, debug=True)
