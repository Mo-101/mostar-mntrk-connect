from flask import Flask, jsonify, request
import logging
import openai
import os
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.debug(f"Received {request.method} request to {request.path}")
    logger.debug(f"Headers: {dict(request.headers)}")
    logger.debug(f"Data: {request.get_data(as_text=True)}")
    
    # Validate JSON
    if not request.is_json:
        logger.error("Request is not JSON")
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    # Get JSON data
    try:
        data = request.get_json()
        logger.debug(f"Parsed JSON data: {data}")
    except Exception as e:
        logger.error(f"Error parsing JSON: {e}")
        return jsonify({"error": "Invalid JSON format"}), 400
    
    # Validate prompt field
    if 'prompt' not in data:
        logger.error("Missing prompt field")
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    # Return test response
    response = {"response": f"You said: {data['prompt']}"}
    logger.debug(f"Sending response: {response}")
    return jsonify(response)

@app.route('/test', methods=['GET', 'POST'])
def test():
    """Test endpoint"""
    logger.debug(f"Received {request.method} request to {request.path}")
    return jsonify({"message": "Test endpoint working"})

@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    logger.error(f"404 error: {request.path}")
    return jsonify({
        "error": "Not Found",
        "message": f"The requested URL {request.path} was not found"
    }), 404

if __name__ == '__main__':
    print("\nStarting server...")
    print("\nAvailable routes:")
    print("  GET,POST /test  - Test endpoint")
    print("  POST     /chat  - Chat endpoint")
    
    # Print registered routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    app.run(host='localhost', port=5000, debug=True)
