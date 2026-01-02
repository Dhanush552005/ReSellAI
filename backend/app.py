from fastapi import FastAPI, UploadFile, Form, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import uuid
import os

from .yolo_detector import YOLOScreenDetector
from .cnn_classifier import predict_damage
from .price_engine import calculate_resale_price
from .ml_model import ResaleMLModel

app = FastAPI(title="Mobile Damage Resale API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

detector = YOLOScreenDetector(
    model_path="models/yolo.pt",
    conf_threshold=0.73
)

ml_model = ResaleMLModel()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def home():
    return {
        "message": "Mobile Damage Resale API is running",
        "docs": "/docs"
    }

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    mrp: float = Form(...),
    ram: int = Form(...),
    storage: int = Form(...),
    age: int = Form(...),
    brand: str = Form(...),
    body_broken: str = Form(...)
):
    body_broken = body_broken.lower() == "true"

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    yolo_result = detector.detect_and_crop(filepath)

    if not yolo_result["detected"]:
        return {
            "status": "rejected",
            "message": "No phone screen detected"
        }

    cnn_result = predict_damage(yolo_result["crop"])

    damage_class = cnn_result["class"]
    cnn_confidence = cnn_result["confidence"]

    ml_score = ml_model.predict_score(
        ram=ram,
        storage=storage,
        age=age,
        body_broken=body_broken,
        brand=brand
    )

    resale_price = calculate_resale_price(
        mrp=mrp,
        cnn_confidence=cnn_confidence,
        damage_class=damage_class,
        ml_score=ml_score
    )
    
    return {
        "status": "accepted",
        "damage": damage_class,
        "cnn_confidence": round(cnn_confidence, 3),
        "ml_score": round(ml_score, 3),
        "resale_price": resale_price
    }
