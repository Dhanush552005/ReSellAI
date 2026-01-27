import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_preprocess
from PIL import Image
import warnings

warnings.filterwarnings('ignore', category=UserWarning, module='tensorflow')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "cnn_model.h5") 
IMAGE_SIZE = (224, 224) 

CLASS_NAMES = [
    "light_broken",
    "moderately_broken",
    "no_broken",
    "severe_broken"
]

CLASS_MAPPING = {i: name for i, name in enumerate(CLASS_NAMES)}

def load_model_keras():
    if not os.path.exists(MODEL_PATH):
        print(f"ERROR: Model file not found at {MODEL_PATH}")
        return None
        
    try:
        model = load_model(MODEL_PATH)
        print("Keras ResNet50 model loaded successfully.")
        return model
    except Exception as e:
        print(f"Error loading Keras model: {e}")
        return None

MODEL = load_model_keras()

def predict_damage(image_path: str):
    if MODEL is None:
        return {"class": "Error", "confidence": 0.0, "message": "Model not loaded."}
        
    try:
        image = Image.open(image_path).convert("RGB")
    except FileNotFoundError:
        return {"class": "Error", "confidence": 0.0, "message": f"Image file not found at {image_path}"}
    
    image = image.resize(IMAGE_SIZE)
    
    image_array = img_to_array(image) 
    
    image_array = np.expand_dims(image_array, axis=0) 
    
    processed_image = resnet_preprocess(image_array)

    predictions = MODEL.predict(processed_image, verbose=0)
    
    probs = predictions[0]

    pred_idx = np.argmax(probs)
    confidence = np.max(probs)

    return {
        "class": CLASS_MAPPING.get(pred_idx, "Unknown"),
        "confidence": round(float(confidence), 4)
    }