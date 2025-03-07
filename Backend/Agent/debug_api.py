from flask import Flask, jsonify, request
import logging

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/')
def home():
    """Home endpoint"""
    logger.debug("Received request to /")
    return jsonify({
        "message": "API is running",
        "endpoints": [
            {"method": "GET", "path": "/"},
            {"method": "GET", "path": "/test"},
            {"method": "POST", "path": "/chat"}
        ]
    })

@app.route('/test')
def test():
    """Test endpoint"""
    logger.debug(f"Received {request.method} request to {request.path}")
    return jsonify({
        "message": "Test endpoint working",
        "method": request.method,
        "path": request.path
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.debug(f"Received {request.method} request to {request.path}")
    logger.debug(f"Headers: {dict(request.headers)}")
    logger.debug(f"Data: {request.get_data(as_text=True)}")
    
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    try:
        data = request.get_json()
        logger.debug(f"Parsed JSON data: {data}")
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON format"}), 400
    
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    response = {"response": f"You said: {data['prompt']}"}
    logger.debug(f"Sending response: {response}")
    return jsonify(response)

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    logger.error(f"404 error: {request.path}")
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found",
        "method": request.method,
        "path": request.path,
        "url": request.url
    }), 404

if __name__ == '__main__':
    print("\nStarting server...")
    print("\nAvailable routes:")
    print("  GET  /      - Home (shows available endpoints)")
    print("  GET  /test  - Test endpoint")
    print("  POST /chat  - Chat endpoint")
    
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    app.run(host='127.0.0.1', port=5000, debug=True)
