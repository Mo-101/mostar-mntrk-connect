from flask import Flask, request, jsonify
import logging
from functools import wraps

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

def log_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"Received {request.method} request to {request.path}")
        logger.info(f"Headers: {dict(request.headers)}")
        if request.data:
            logger.info(f"Request data: {request.get_data(as_text=True)}")
        return f(*args, **kwargs)
    return decorated_function

@app.route('/health', methods=['GET'])
@log_request
def health_check():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "message": "Server is running"}), 200

@app.route('/test', methods=['POST'])
@log_request
def test():
    """Test endpoint"""
    try:
        return jsonify({"message": "Hello, world!"}), 200
    except Exception as e:
        logger.exception("Error in test endpoint")
        return jsonify({"error": str(e)}), 500

@app.route('/chat', methods=['POST'])
@log_request
def chat():
    """Chat endpoint"""
    try:
        # Validate Content-Type
        if not request.is_json:
            logger.error("Request Content-Type is not application/json")
            return jsonify({
                "error": "Content-Type must be application/json",
                "received": request.headers.get('Content-Type')
            }), 400

        # Parse JSON data
        try:
            data = request.get_json()
            logger.info(f"Parsed JSON data: {data}")
        except Exception as e:
            logger.error(f"Failed to parse JSON: {e}")
            return jsonify({"error": "Invalid JSON format"}), 400

        # Validate required fields
        if 'prompt' not in data:
            logger.error("Missing 'prompt' field in request")
            return jsonify({"error": "Missing required field: prompt"}), 400

        # Process request
        response = {
            "response": f"You said: {data['prompt']}"
        }
        logger.info(f"Sending response: {response}")
        return jsonify(response), 200

    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        return jsonify({"error": str(e)}), 500

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    logger.error(f"404 error: {request.url}")
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found on this server"
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 errors"""
    logger.error(f"405 error: {request.method} {request.url}")
    return jsonify({
        "error": "Method Not Allowed",
        "message": f"The method {request.method} is not allowed for {request.path}"
    }), 405

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.exception("Server error")
    return jsonify({
        "error": "Internal Server Error",
        "message": "An unexpected error occurred"
    }), 500

if __name__ == '__main__':
    logger.info("Starting server on http://127.0.0.1:5000")
    logger.info("Available routes:")
    logger.info("  GET  /health - Health check endpoint")
    logger.info("  POST /test   - Test endpoint")
    logger.info("  POST /chat   - Chat endpoint")
    
    # Print all registered routes
    logger.info("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    app.run(host='127.0.0.1', port=5000, debug=True)
