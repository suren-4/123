from flask import Flask, request, jsonify
from flask_cors import CORS
import nltk
from nltk.stem import WordNetLemmatizer
import pickle
import numpy as np
import json
import random
import os

app = Flask(__name__)
# Allow all origins for testing
CORS(app, resources={r"/*": {"origins": "*"}})

def simple_tokenize(text):
    # Simple word tokenization
    return text.lower().split()

# Make sure we're in the right directory
current_dir = os.path.dirname(os.path.abspath(__file__))
os.chdir(current_dir)

print("Current working directory:", os.getcwd())
print("Available files:", os.listdir())

try:
    lemmatizer = WordNetLemmatizer()
    model = pickle.load(open('chatbot_model.pkl', 'rb'))
    words = pickle.load(open('words.pkl', 'rb'))
    classes = pickle.load(open('classes.pkl', 'rb'))
    intents = json.loads(open('intents.json').read())
    print("Successfully loaded all required files")
except Exception as e:
    print(f"Error loading files: {str(e)}")
    print("Current directory:", os.getcwd())
    print("Files in directory:", os.listdir())

def clean_up_sentence(sentence):
    # Tokenize and lemmatize the pattern
    sentence_words = simple_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word) for word in sentence_words]
    
    # Remove punctuation and special characters
    sentence_words = [word for word in sentence_words if word.isalnum()]
    
    print(f"Cleaned sentence: {sentence_words}")  # Debug print
    return sentence_words

def bow(sentence, words):
    # Tokenize the pattern
    sentence_words = clean_up_sentence(sentence)
    
    # Bag of words - matrix of N words, vocabulary matrix
    bag = [0]*len(words)  
    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s: 
                # If word is present in the pattern, assign 1
                bag[i] = 1
                print(f"Match found: {w}")  # Debug print
    
    print(f"Bag of words: {bag}")  # Debug print
    return np.array(bag)

@app.route('/api/chatbot', methods=['POST', 'OPTIONS'])
def chat():
    if request.method == 'OPTIONS':
        response = jsonify({'status': 'ok'})
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
        response.headers.add('Access-Control-Allow-Methods', 'POST')
        return response

    try:
        print("Received request:", request.json)
        data = request.json
        message = data.get('message', '')
        print(f"Processing message: {message}")

        # Get bag of words
        p = bow(message, words)
        
        # Get prediction
        res = model.predict([p])[0]
        print(f"Model prediction: {res}")  # Debug print
        
        # Get highest probability
        results = [[i, r] for i, r in enumerate(res)]
        results.sort(key=lambda x: x[1], reverse=True)
        
        print(f"Sorted results: {results}")  # Debug print
        
        # Get response
        intent = classes[results[0][0]]
        print(f"Detected intent: {intent}")
        
        response = "I'm not sure how to respond to that."
        for i in intents['intents']:
            if i['tag'] == intent:
                response = random.choice(i['responses'])
                print(f"Selected response: {response}")
                break
                
        return jsonify({
            'response': response,
            'intent': intent,  # Return detected intent for debugging
            'confidence': float(results[0][1])  # Return confidence score
        })
        
    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({
            'error': 'Internal server error',
            'message': str(e)
        }), 500

if __name__ == '__main__':
    print("Starting Flask server on port 8000...")
    app.run(debug=True, port=8000, host='0.0.0.0') 