from flask import Flask, jsonify
import logging

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)

@app.route('/hello')
def hello():
    logger.debug("Received request to /hello")
    return jsonify({"message": "Hello, world!"})

if __name__ == '__main__':
    # Print all registered routes
    print("\nRegistered routes:")
    for rule in app.url_map.iter_rules():
        print(f"{rule.endpoint}: {rule.methods} {rule.rule}")
    
    # Run the app
    print("\nStarting server on http://localhost:5000")
    print("Try: curl http://localhost:5000/hello")
    app.run(host='localhost', port=5000)
