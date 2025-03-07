from flask import Flask, jsonify, request
import logging

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Explicitly register routes with methods
@app.route('/test', methods=['POST'])
def test():
    logger.debug("Received request to /test")
    logger.debug(f"Request method: {request.method}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/chat', methods=['POST'])
def chat():
    logger.debug("Received request to /chat")
    logger.debug(f"Request method: {request.method}")
    logger.debug(f"Request headers: {dict(request.headers)}")
    logger.debug(f"Request data: {request.get_data(as_text=True)}")
    
    try:
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        logger.debug(f"Parsed JSON data: {data}")
        
        if 'prompt' not in data:
            logger.error("Missing prompt field")
            return jsonify({"error": "Missing prompt field"}), 400
            
        return jsonify({
            "response": f"You asked: {data['prompt']}"
        }), 200
            
    except Exception as e:
        logger.exception("Error processing request")
        return jsonify({"error": str(e)}), 500

@app.before_request
def log_request_info():
    logger.debug('Headers: %s', dict(request.headers))
    logger.debug('Body: %s', request.get_data())
    logger.debug('URL: %s', request.url)
    logger.debug('Method: %s', request.method)

if __name__ == '__main__':
    # Print registered routes
    logger.info("Registered routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    # Run the app
    app.run(host='127.0.0.1', port=8081, debug=True)
