from flask import Blueprint, jsonify, request
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create blueprint
api_bp = Blueprint('api', __name__)

@api_bp.route('/', methods=['GET'])
def home():
    """API home endpoint"""
    logger.info("GET /api/")
    return jsonify({
        "status": "ok",
        "message": "API is running",
        "endpoints": {
            "GET /api": "This help message",
            "GET /api/test": "Test endpoint",
            "POST /api/chat": "Chat endpoint"
        }
    })

@api_bp.route('/test', methods=['GET'])
def test():
    """Test endpoint"""
    logger.info("GET /api/test")
    return jsonify({
        "status": "ok",
        "message": "Test endpoint working"
    })

@api_bp.route('/chat', methods=['POST'])
def chat():
    """Chat endpoint"""
    logger.info(f"POST /api/chat - Headers: {dict(request.headers)}")
    
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

@api_bp.errorhandler(404)
def not_found(e):
    """Handle 404 errors"""
    return jsonify({
        "status": "error",
        "message": f"Route not found: {request.path}",
        "method": request.method
    }), 404
