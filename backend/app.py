from flask import Flask, request, jsonify
from flask_cors import CORS
import time
import random

app = Flask(__name__)
CORS(app)

@app.route('/generate-avatar', methods=['POST'])
def generate_avatar():
    # Simulate processing time
    time.sleep(2)
    
    # Simulate occasional errors
    if random.random() < 0.1:  # 10% chance of error
        return jsonify({"error": "Oopsie! Our cute little server got a tummy ache. Please try again!"}), 500
    
    # Return dummy image URL
    return jsonify({"avatarUrl": "https://your.placeholder.png"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
