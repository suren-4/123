import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
import json
import os
from classifier import SimpleClassifier

# This script manually creates a model without using pickle

lemmatizer = WordNetLemmatizer()

# Load intents
intents = json.loads(open('intents.json').read())

# Process data
words = []
classes = []
documents = []
ignore_words = ['?', '!']

for intent in intents['intents']:
    for pattern in intent['patterns']:
        w = nltk.word_tokenize(pattern)
        words.extend(w)
        documents.append((w, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [lemmatizer.lemmatize(w.lower()) for w in words if w not in ignore_words]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

print(f"Created {len(documents)} documents")
print(f"Created {len(classes)} classes: {classes}")
print(f"Created {len(words)} unique lemmatized words")

# Save words and classes as Python code
with open('model_data.py', 'w') as f:
    f.write("# Auto-generated model data\n\n")
    f.write(f"words = {repr(words)}\n\n")
    f.write(f"classes = {repr(classes)}\n\n")

print("Created model_data.py with words and classes")
print("Now you can run chatgui_direct.py") 