from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    print(f"Received request: {request.method} {request.url}")
    print(f"Headers: {dict(request.headers)}")
    print(f"Data: {request.get_data(as_text=True)}")
    
    if request.is_json:
        data = request.get_json()
        return jsonify({
            "response": f"You sent: {data.get('prompt', 'no prompt')}"
        })
    return jsonify({"error": "Request must be JSON"}), 400

if __name__ == '__main__':
    print("Starting server on http://127.0.0.1:8081")
    print("Available routes:")
    print("  POST /chat")
    app.run(host='127.0.0.1', port=8081, debug=True)
