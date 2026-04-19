from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form,
    Depends
)

from sqlalchemy.orm import Session

from ..db.session import get_db
from ..core.security import get_current_user

from ..services.prediction_service import (
    run_prediction,
    sell_from_prediction
)

router = APIRouter(
    prefix="/predict",
    tags=["Prediction"]
)


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
    db: Session = Depends(get_db)
):
    return run_prediction(
        db,
        file,
        mrp,
        ram,
        storage,
        age,
        brand,
        body_broken,
        user
    )


@router.post("/sell-from-prediction")
def sell_phone(
    image_path: str = Form(...),
    brand: str = Form(...),
    ram: int = Form(...),
    storage: int = Form(...),
    age: int = Form(...),
    damage: str = Form(...),
    price: float = Form(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return sell_from_prediction(
        db,
        image_path,
        brand,
        ram,
        storage,
        age,
        damage,
        price,
        user
    )