from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello, world!"})

@app.route('/echo', methods=['POST'])
def echo():
    data = request.get_json()
    return jsonify({"you_sent": data})

if __name__ == '__main__':
    print("Starting server...")
    print("Available routes:")
    print("  GET  /hello")
    print("  POST /echo")
    # Use a different port
    app.run(host='127.0.0.1', port=5000, debug=True)
