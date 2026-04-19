import os
import uuid
import shutil

from fastapi import HTTPException

from ..models.prediction import Prediction
from ..models.phone import Phone

from ..repositories.prediction_repository import create_prediction
from ..repositories.phone_repository import create_phone
from ..repositories.user_repository import save_user

from ..ai.yolo_detector import YOLOScreenDetector
from ..ai.cnn_classifier import predict_damage
from ..ai.ml_model import ResaleMLModel
from ..ai.price_engine import calculate_resale_price


UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

detector = YOLOScreenDetector(
    model_path="ml_models/yolo.pt",
    conf_threshold=0.73
)

ml_model = ResaleMLModel()


def run_prediction(
    db,
    file,
    mrp,
    ram,
    storage,
    age,
    brand,
    body_broken,
    user
):
    if user.credits <= 0:
        raise HTTPException(
            status_code=403,
            detail="No credits left"
        )

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

    cnn_result = predict_damage(
        yolo_result["crop"]
    )

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
        damage_class=damage_class,
        cnn_confidence=cnn_confidence,
        ml_score=ml_score
    )

    user.credits -= 1
    save_user(db)

    prediction = Prediction(
        user_id=user.id,
        damage=damage_class,
        cnn_score=cnn_confidence,
        ml_score=ml_score,
        price=resale_price
    )

    create_prediction(db, prediction)

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
        "cnn_score": float(cnn_confidence)
    }


def sell_from_prediction(
    db,
    image_path,
    brand,
    ram,
    storage,
    age,
    damage,
    price,
    user
):
    phone = Phone(
        seller_id=user.id,
        image_path=image_path,
        brand=brand,
        ram=ram,
        storage=storage,
        age=age,
        damage=damage,
        price=price,
        status="on_sale"
    )

    create_phone(db, phone)

    return {
        "message": "Phone listed for sale"
    }