import numpy as np

class SimpleClassifier:
    def __init__(self):
        self.classes = []
        self.words = []
        self.training_data = []
        self.context = "archaeological"
        
    def fit(self, X, y):
        self.training_data = list(zip(X, y))
        return self
    
    def predict(self, X):
        # For a single input, find the most similar training example
        results = []
        for x in X:
            best_match = None
            best_score = -1
            
            for train_x, train_y in self.training_data:
                # Calculate similarity (dot product)
                score = np.dot(x, train_x)
                if score > best_score:
                    best_score = score
                    best_match = train_y
            
            results.append(best_match)
        return np.array(results)
    
    def predict_proba(self, X):
        results = []
        for x in X:
            scores = np.zeros(len(self.classes))
            
            # Add weight to archaeological terms
            archaeological_weight = 1.5
            
            for i, (train_x, train_y) in enumerate(self.training_data):
                similarity = np.dot(x, train_x)
                
                # Increase weight for archaeological terms
                if any(word in self.words for word in [
                    'artifact', 'chola', 'temple', 'excavation', 'heritage'
                ]):
                    similarity *= archaeological_weight
                    
                class_idx = np.argmax(train_y)
                scores[class_idx] += similarity
            
            if np.sum(scores) > 0:
                scores = scores / np.sum(scores)
            results.append(scores)
        return np.array(results) 