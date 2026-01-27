import os
from ultralytics import YOLO

class YOLOScreenDetector:
    def __init__(self, model_path, conf_threshold=0.73):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        model_path = os.path.join(base_dir, model_path)

        self.model = YOLO(model_path)
        self.conf_threshold = conf_threshold

    def detect_and_crop(self, image_path):
        results = self.model.predict(
            source=image_path,
            conf=self.conf_threshold,
            verbose=False
        )

        if not results or results[0].boxes is None or len(results[0].boxes) == 0:
            return {"detected": False}

        box = results[0].boxes.xyxy[0]
        x1, y1, x2, y2 = map(int, box)

        return {
            "detected": True,
            "crop": image_path  
        }
