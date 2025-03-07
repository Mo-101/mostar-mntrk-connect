from flask import Flask, jsonify, request
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    logger.info("Received request to /test")
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/chat', methods=['POST'])
def chat():
    logger.info("Received request to /chat")
    logger.info(f"Request headers: {dict(request.headers)}")
    logger.info(f"Request data: {request.get_data(as_text=True)}")
    
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Request must be JSON"}), 400
        
    data = request.get_json()
    logger.info(f"Parsed JSON data: {data}")
    
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing prompt field"}), 400
        
    return jsonify({
        "response": f"You asked: {data['prompt']}"
    }), 200

if __name__ == '__main__':
    logger.info("Starting server with routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    app.run(port=8081, debug=True)
