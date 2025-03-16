import os

# Remove old model files
if os.path.exists('chatbot_model.pkl'):
    os.remove('chatbot_model.pkl')
    print("Removed old model file")

if os.path.exists('words.pkl'):
    os.remove('words.pkl')
    print("Removed words.pkl")

if os.path.exists('classes.pkl'):
    os.remove('classes.pkl')
    print("Removed classes.pkl")

print("Please run train_chatbot.py to create a new model") 