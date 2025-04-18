import joblib
import numpy as np
import pandas as pd

# Load the pre-trained model
def load_model():
    try:
        model = joblib.load('resources/fraud_detection_model.pkl')  # Adjust the path
        return model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None

# Predict fraud using the loaded model
def predict_fraud(features):
    model = load_model()
    
    if model is None:
        return {"error": "Model loading failed."}
    
    # Convert features to a DataFrame (or numpy array) matching the model's training format
    try:
        # Assuming features is a list of values, so we convert it to a DataFrame
        feature_columns = ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8', 'V9', 'V10', 'V11', 'V12', 'V13', 'V14', 'V15', 'V16', 'V17', 'V18', 'V19', 'V20', 'V21', 'V22', 'V23', 'V24', 'V25', 'V26', 'V27', 'V28', 'Amount']
        features_df = pd.DataFrame([features], columns=feature_columns)  # Single row DataFrame
        
        prediction = model.predict(features_df)
        probability = model.predict_proba(features_df)[0][1]  # Probability of being fraud
        
        return {"fraud": prediction[0] == 1, "probability": probability}
    except Exception as e:
        return {"error": f"Error during prediction: {e}"}
