import os
import uuid
import shutil
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from bson import ObjectId
from ..db.mongo import users_col, predictions_col, phones_col
from ..core.security import get_current_user
from ..services.yolo_detector import YOLOScreenDetector
from ..services.cnn_classifier import predict_damage
from ..services.ml_model import ResaleMLModel
from ..services.price_engine import calculate_resale_price


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

router = APIRouter(prefix="/predict", tags=["Prediction"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "yolo.pt")

detector = YOLOScreenDetector(model_path=MODEL_PATH, conf_threshold=0.73)
ml_model = ResaleMLModel()


@router.post("")
async def predict(
    file: UploadFile = File(...),
    mrp: float = Form(...),
    ram: int = Form(...),
    storage: int = Form(...),
    age: int = Form(...),
    brand: str = Form(...),
    body_broken: str = Form(...),
    user=Depends(get_current_user),
):
    if user["credits"] <= 0:
        raise HTTPException(status_code=403, detail="No credits left")

    body_broken = body_broken.lower() == "true"

    filename = f"{uuid.uuid4()}.jpg"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    yolo_result = detector.detect_and_crop(filepath)

    if not yolo_result["detected"]:
        return {"status": "rejected", "message": "No phone screen detected"}

    cnn_result = predict_damage(yolo_result["crop"])

    damage_class = cnn_result["class"]
    cnn_confidence = cnn_result["confidence"]

    ml_score = ml_model.predict_score(
        ram=ram,
        storage=storage,
        age=age,
        body_broken=body_broken,
        brand=brand,
    )

    resale_price = calculate_resale_price(
        mrp=mrp,
        cnn_confidence=cnn_confidence,
        damage_class=damage_class,
        ml_score=ml_score,
    )

    users_col.update_one(
        {"_id": user["_id"]},
        {"$inc": {"credits": -1}}
    )
    predictions_col.insert_one({

        "user_id": user["_id"],
        "damage": damage_class,
        "cnn_score": cnn_confidence,
        "ml_score": ml_score,
        "price": resale_price,
    })

    return {
        "status": "accepted",
        "image_path": filepath,
        "brand": brand,
        "ram": ram,
        "storage": storage,
        "age": age,
        "body_broken": body_broken,
        "damage": damage_class,
        "resale_price": resale_price,
        "ml_score": float(ml_score),       
        "cnn_score": float(cnn_confidence),
    }


@router.post("/sell-from-prediction")
def sell_from_prediction(
    image_path: str = Form(...),
    brand: str = Form(...),
    ram: int = Form(...),
    storage: int = Form(...),
    age: int = Form(...),
    damage: str = Form(...),
    price: float = Form(...),
    user=Depends(get_current_user),
):
    phone = {
        "seller_id": user["_id"],
        "image_path": image_path,
        "brand": brand,
        "ram": ram,
        "storage": storage,
        "age": age,
        "damage": damage,
        "price": price,
        "status": "on_sale",
    }

    phones_col.insert_one(phone)

    return {"message": "Phone listed for sale"}
