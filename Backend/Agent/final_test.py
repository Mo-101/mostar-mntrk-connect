from flask import Flask, jsonify, request, url_for
import logging

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def index():
    """List all available routes"""
    routes = {}
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            routes[rule.endpoint] = {
                'url': str(rule),
                'methods': list(rule.methods)
            }
    return jsonify(routes)

@app.route('/test', methods=['POST'])
def test():
    """Test endpoint"""
    logger.debug(f"Received {request.method} request to /test")
    logger.debug(f"Headers: {dict(request.headers)}")
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.debug(f"Received {request.method} request to /chat")
    logger.debug(f"Headers: {dict(request.headers)}")
    logger.debug(f"Raw data: {request.get_data(as_text=True)}")
    
    try:
        if not request.is_json:
            logger.error("Request is not JSON")
            return jsonify({"error": "Request must be JSON"}), 400
            
        data = request.get_json()
        logger.debug(f"Parsed JSON data: {data}")
        
        if 'prompt' not in data:
            logger.error("Missing prompt field")
            return jsonify({"error": "Missing prompt field"}), 400
            
        response = {
            "response": f"You asked: {data['prompt']}"
        }
        logger.debug(f"Sending response: {response}")
        return jsonify(response), 200
            
    except Exception as e:
        logger.exception("Error processing request")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found_error(error):
    """Handle 404 errors"""
    logger.error(f"404 error: {request.url}")
    return jsonify({"error": "Route not found", "url": request.url}), 404

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all other exceptions"""
    logger.exception("Unhandled exception")
    return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting server...")
    logger.info("Registered routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    app.run(host='127.0.0.1', port=8081, debug=True)
