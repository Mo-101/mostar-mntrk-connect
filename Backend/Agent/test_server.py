from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/test', methods=['POST'])
def test():
    return jsonify({"message": "Hello, world!"}), 200

@app.route('/chat', methods=['POST'])
def chat():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400
        
    data = request.get_json()
    if 'prompt' not in data:
        return jsonify({"error": "Missing prompt field"}), 400
        
    # Return a test response
    return jsonify({
        "response": f"You asked: {data['prompt']}"
    }), 200

if __name__ == '__main__':
    print("Starting server with routes:")
    print("POST /test")
    print("POST /chat")
    app.run(port=8081, debug=True)
