from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "Hello, world!"})

if __name__ == '__main__':
    print("Starting server on http://127.0.0.1:5000/")
    app.run(host='127.0.0.1', port=5000)
