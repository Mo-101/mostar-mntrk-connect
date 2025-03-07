from flask import Flask, jsonify, request
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    """Home endpoint"""
    logger.info("GET /")
    return jsonify({
        "status": "running",
        "endpoints": {
            "GET /": "This help message",
            "GET /test": "Test endpoint",
            "POST /chat": "Chat endpoint"
        }
    })

@app.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    logger.info("GET /test")
    return jsonify({
        "status": "ok",
        "message": "Test endpoint working"
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.info(f"POST /chat - Headers: {dict(request.headers)}")
    
    # Validate JSON
    if not request.is_json:
        return jsonify({
            "status": "error",
            "message": "Content-Type must be application/json"
        }), 400
    
    # Get and validate data
    try:
        data = request.get_json()
        logger.info(f"Request data: {data}")
        
        if 'prompt' not in data:
            return jsonify({
                "status": "error",
                "message": "Missing 'prompt' field"
            }), 400
            
        return jsonify({
            "status": "ok",
            "response": f"You said: {data['prompt']}"
        })
        
    except Exception as e:
        logger.error(f"Error processing request: {e}")
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": f"Route not found: {request.path}",
        "method": request.method
    }), 404

if __name__ == '__main__':
    # Kill any existing processes on port 5000 first
    import os
    os.system('taskkill /F /IM python.exe 2> nul')
    
    # Start server
    print("\nStarting server on http://127.0.0.1:5000")
    print("Available routes:")
    print("  GET  /      - Show this help message")
    print("  GET  /test  - Test the API")
    print("  POST /chat  - Send a chat message")
    print("\nPress Ctrl+C to quit")
    
    app.run(
        host='127.0.0.1',
        port=5000,
        debug=False  # Set to True for development
    )
