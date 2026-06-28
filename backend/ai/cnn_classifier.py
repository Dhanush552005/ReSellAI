import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input as resnet_preprocess
from PIL import Image
import warnings

warnings.filterwarnings("ignore", category=UserWarning, module="tensorflow")

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "ml_models", "cnn_model.h5")
IMAGE_SIZE = (224, 224)

CLASS_NAMES = [
    "light_broken",
    "moderately_broken",
    "no_broken",
    "severe_broken"
]

CLASS_MAPPING = {i: name for i, name in enumerate(CLASS_NAMES)}

# Lazy loaded CNN model
MODEL = None


def get_model():
    global MODEL

    if MODEL is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")

        print("Loading CNN model...")
        MODEL = load_model(MODEL_PATH)
        print("CNN model loaded successfully.")

    return MODEL


def predict_damage(image_path: str):
    model = get_model()

    image = Image.open(image_path).convert("RGB")
    image = image.resize(IMAGE_SIZE)

    image_array = img_to_array(image)
    image_array = np.expand_dims(image_array, axis=0)
    processed_image = resnet_preprocess(image_array)

    predictions = model.predict(processed_image, verbose=0)

    probs = predictions[0]
    pred_idx = np.argmax(probs)
    confidence = np.max(probs)

    return {
        "class": CLASS_MAPPING.get(pred_idx, "Unknown"),
        "confidence": round(float(confidence), 4)
    }