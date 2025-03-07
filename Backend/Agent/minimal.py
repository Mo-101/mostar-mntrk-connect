from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Hello, world!"})

if __name__ == '__main__':
    print("Starting minimal server...")
    print("Available route: GET /")
    app.run(host='127.0.0.1', port=5000)
