from flask import Flask, jsonify, request
import logging

# Configure detailed logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    """Log all requests for debugging"""
    logger.debug(f"Received request: {request.method} {request.url}")
    logger.debug(f"Headers: {dict(request.headers)}")
    logger.debug(f"Path: {path}")
    if request.method == 'POST':
        logger.debug(f"Data: {request.get_data(as_text=True)}")
    
    if path == '':
        return jsonify({"message": "Server is running"}), 200
    elif path == 'test' and request.method == 'POST':
        return jsonify({"message": "Hello, world!"}), 200
    elif path == 'chat' and request.method == 'POST':
        try:
            if not request.is_json:
                return jsonify({"error": "Request must be JSON"}), 400
            data = request.get_json()
            if 'prompt' not in data:
                return jsonify({"error": "Missing prompt field"}), 400
            return jsonify({"response": f"You asked: {data['prompt']}"}), 200
        except Exception as e:
            logger.exception("Error in /chat")
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": f"Route not found: {path}"}), 404

if __name__ == '__main__':
    logger.info("Starting minimal server on http://127.0.0.1:8081")
    app.run(host='127.0.0.1', port=8081, debug=True)
