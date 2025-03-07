from flask import Flask, request, jsonify
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Basic routes without decorators
@app.route('/')
def root():
    """Root endpoint"""
    return jsonify({
        "message": "Server is running",
        "endpoints": [
            {"method": "GET", "path": "/"},
            {"method": "GET", "path": "/health"},
            {"method": "POST", "path": "/test"},
            {"method": "POST", "path": "/chat"}
        ]
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "message": "Server is running"
    })

@app.route('/test', methods=['POST'])
def test():
    """Test endpoint"""
    return jsonify({
        "message": "Hello, world!"
    })

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
        
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({"error": "Missing required field: prompt"}), 400
        
    return jsonify({
        "response": f"You said: {data['prompt']}"
    })

# Error handlers
@app.errorhandler(404)
def not_found(e):
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found"
    }), 404

@app.errorhandler(405)
def method_not_allowed(e):
    return jsonify({
        "error": "Method Not Allowed",
        "message": f"The method {request.method} is not allowed for {request.path}"
    }), 405

if __name__ == '__main__':
    print("\nStarting server on http://127.0.0.1:5000")
    print("\nAvailable routes:")
    print("  GET  /        - Root endpoint (shows available endpoints)")
    print("  GET  /health  - Health check endpoint")
    print("  POST /test    - Test endpoint")
    print("  POST /chat    - Chat endpoint")
    app.run(host='127.0.0.1', port=5000, debug=True)
