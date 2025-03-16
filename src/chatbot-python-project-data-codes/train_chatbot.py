import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
import json
import pickle
import random
import os
from nltk.corpus import stopwords

# Import the classifier from the shared module
from classifier import SimpleClassifier

def simple_tokenize(text):
    # Simple word tokenization
    return text.lower().split()

print("Loading intents...")
lemmatizer = WordNetLemmatizer()
intents = json.loads(open('intents.json').read())

words = []
classes = []
documents = []
ignore_letters = ['?', '!', '.', ',']

for intent in intents['intents']:
    print(f"\nIntent: {intent['tag']}")
    print(f"Patterns: {intent['patterns']}")
    for pattern in intent['patterns']:
        word_list = simple_tokenize(pattern)
        words.extend(word_list)
        documents.append((word_list, intent['tag']))
        if intent['tag'] not in classes:
            classes.append(intent['tag'])

words = [lemmatizer.lemmatize(word) for word in words if word not in ignore_letters]
words = sorted(list(set(words)))
classes = sorted(list(set(classes)))

print(f"\nTotal patterns: {len(documents)}")
print(f"Classes: {classes}")
print(f"Unique words: {len(words)}")

# Add these archaeological specific words to your words list
archaeological_terms = [
    'artifact', 'excavation', 'archaeology', 'heritage', 'ancient',
    'chola', 'pallava', 'pandya', 'temple', 'inscription', 'bronze',
    'manuscript', 'tamil', 'kalanjiyam', 'museum', 'historical'
]
words.extend(archaeological_terms)

# Save words and classes
pickle.dump(words, open('words.pkl', 'wb'))
pickle.dump(classes, open('classes.pkl', 'wb'))

# Create training data
training = []
output_empty = [0] * len(classes)

# Create bag of words for each pattern
for doc in documents:
    bag = []
    word_patterns = doc[0]
    word_patterns = [lemmatizer.lemmatize(word.lower()) for word in word_patterns]
    
    for word in words:
        bag.append(1) if word in word_patterns else bag.append(0)
    
    output_row = list(output_empty)
    output_row[classes.index(doc[1])] = 1
    training.append([bag, output_row])

random.shuffle(training)
training = np.array(training, dtype=object)

train_x = list(training[:, 0])
train_y = list(training[:, 1])

# Create and train the model
print("\nTraining model...")
model = SimpleClassifier()
model.classes = classes
model.words = words
model.fit(train_x, train_y)

# Save the model
pickle.dump(model, open('chatbot_model.pkl', 'wb'))
print("\nModel trained and saved successfully!")
