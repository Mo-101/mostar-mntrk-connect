from flask import Flask, jsonify, request
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

@app.route('/hello')
def hello():
    """Test endpoint"""
    logger.debug("Received request to /hello")
    return jsonify({"message": "Hello, world!"})

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.debug("Received request to /chat")
    logger.debug(f"Headers: {dict(request.headers)}")
    
    # Validate JSON
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    # Get JSON data
    try:
        data = request.get_json()
        logger.debug(f"Request data: {data}")
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON format"}), 400
    
    # Validate prompt field
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    # Return response
    response = {"response": f"You said: {data['prompt']}"}
    logger.debug(f"Sending response: {response}")
    return jsonify(response)

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found"
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    """Handle 405 errors"""
    return jsonify({
        "error": "Method Not Allowed",
        "message": f"The method {request.method} is not allowed for {request.path}"
    }), 405

if __name__ == '__main__':
    # Print registered routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    print("\nStarting server on http://localhost:5000")
    print("Try these commands:")
    print("  curl http://localhost:5000/hello")
    print('  curl -X POST http://localhost:5000/chat -H "Content-Type: application/json" -d \'{"prompt":"test"}\'')
    
    # Run the app
    app.run(host='localhost', port=5000)
