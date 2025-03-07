from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "API is running"})

@app.route('/test')
def test():
    return jsonify({"message": "Test endpoint"})

@app.route('/chat', methods=['POST'])
def chat():
    return jsonify({"message": "Chat endpoint"})

if __name__ == '__main__':
    print("Starting server...")
    print("Available routes:")
    print("  GET  /")
    print("  GET  /test")
    print("  POST /chat")
    app.run(port=5000)
