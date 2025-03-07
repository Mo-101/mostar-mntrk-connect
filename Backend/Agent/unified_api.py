
from flask import Flask, request, jsonify
import logging
import os
from functools import wraps
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG if os.getenv('DEBUG') == 'true' else logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

# Request logging middleware
def log_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        logger.info(f"Received {request.method} request to {request.path}")
        logger.debug(f"Headers: {dict(request.headers)}")
        if request.data:
            logger.debug(f"Request data: {request.get_data(as_text=True)}")
        return f(*args, **kwargs)
    return decorated_function

# Home endpoint
@app.route('/', methods=['GET'])
@log_request
def home():
    """Home endpoint with API documentation"""
    routes = {}
    for rule in app.url_map.iter_rules():
        if rule.endpoint != 'static':
            routes[rule.endpoint] = {
                'url': str(rule),
                'methods': list(rule.methods)
            }
    
    return jsonify({
        "status": "running",
        "version": "1.0.0",
        "endpoints": routes
    })

# Health check endpoint
@app.route('/health', methods=['GET'])
@log_request
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy", 
        "message": "Server is running",
        "environment": os.getenv('FLASK_ENV', 'production')
    }), 200

# Test endpoint
@app.route('/test', methods=['GET', 'POST'])
@log_request
def test():
    """Test endpoint"""
    try:
        if request.method == 'GET':
            return jsonify({
                "status": "ok",
                "message": "Test endpoint working",
                "method": "GET"
            })
        else:
            return jsonify({
                "status": "ok",
                "message": "Test endpoint working",
                "method": "POST"
            })
    except Exception as e:
        logger.exception("Error in test endpoint")
        return jsonify({"error": str(e)}), 500

# Chat endpoint
@app.route('/chat', methods=['POST'])
@log_request
def chat():
    """Chat endpoint"""
    try:
        # Validate Content-Type
        if not request.is_json:
            logger.error("Request Content-Type is not application/json")
            return jsonify({
                "status": "error",
                "message": "Content-Type must be application/json",
                "received": request.headers.get('Content-Type')
            }), 400

        # Parse JSON data
        try:
            data = request.get_json()
            logger.debug(f"Parsed JSON data: {data}")
        except Exception as e:
            logger.error(f"Failed to parse JSON: {e}")
            return jsonify({
                "status": "error",
                "message": "Invalid JSON format"
            }), 400

        # Validate required fields
        if 'prompt' not in data:
            logger.error("Missing 'prompt' field in request")
            return jsonify({
                "status": "error",
                "message": "Missing required field: prompt"
            }), 400

        # Process request
        # TODO: Add integration with AI services here
        response = {
            "status": "ok",
            "response": f"You said: {data['prompt']}"
        }
        
        logger.info(f"Sending response for prompt: {data['prompt'][:50]}...")
        return jsonify(response), 200

    except Exception as e:
        logger.exception("Unexpected error in chat endpoint")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

# Error handlers
@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    logger.error(f"404 error: {request.url}")
    return jsonify({
        "status": "error",
        "message": f"The requested URL {request.path} was not found on this server"
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 errors"""
    logger.error(f"405 error: {request.method} {request.url}")
    return jsonify({
        "status": "error",
        "message": f"The method {request.method} is not allowed for {request.path}"
    }), 405

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    logger.exception("Server error")
    return jsonify({
        "status": "error",
        "message": "An unexpected error occurred"
    }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    
    logger.info(f"Starting server on http://127.0.0.1:{port}")
    logger.info(f"Environment: {os.getenv('FLASK_ENV', 'production')}")
    logger.info(f"Debug mode: {debug}")
    
    # Print all registered routes
    logger.info("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        logger.info(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    # Run the app
    app.run(host='0.0.0.0', port=port, debug=debug)
