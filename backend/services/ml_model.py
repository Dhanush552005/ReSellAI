import os
import pickle
import numpy as np

class ResaleMLModel:
    def __init__(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, "models", "xgboost_resale_model.pkl")

        with open(model_path, "rb") as f:
            self.model = pickle.load(f)

    def encode_brand(self, brand: str):
        brand = brand.lower().strip()
        return [
            1 if brand == "apple" else 0,
            1 if brand == "oneplus" else 0,
            1 if brand == "redmi" else 0,
            1 if brand == "samsung" else 0,
            1 if brand == "xiaomi" else 0,
        ]

    def predict_score(self, ram, storage, age, body_broken, brand):
        features = np.array([[
            ram,
            storage,
            age,
            int(body_broken),
            *self.encode_brand(brand)
        ]])

        return float(self.model.predict(features)[0])
