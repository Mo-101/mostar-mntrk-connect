from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({
        "message": "Server is running",
        "endpoints": [
            "GET /",
            "POST /test",
            "POST /chat"
        ]
    })

@app.route('/test', methods=['POST'])
def test():
    return jsonify({
        "message": "Test endpoint working"
    })

@app.route('/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"error": "Content-Type must be application/json"}), 400
    
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({"error": "Missing required field: prompt"}), 400
    
    return jsonify({
        "response": f"You said: {data['prompt']}"
    })

if __name__ == '__main__':
    print("Starting server...")
    print("Available routes:")
    print("  GET  /      - Home (shows available endpoints)")
    print("  POST /test  - Test endpoint")
    print("  POST /chat  - Chat endpoint")
    app.run(port=5000)
