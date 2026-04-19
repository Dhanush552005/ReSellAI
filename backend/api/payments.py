from fastapi import APIRouter, Form, Depends
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..core.security import get_current_user

from ..services.payment_service import (
    create_credit_order,
    verify_credit_payment
)

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.post("/create-credit-order")
def create_order(
    credits: int = Form(...),
    user=Depends(get_current_user)
):
    return create_credit_order(credits)


@router.post("/verify-credit-payment")
def verify_payment(
    razorpay_order_id: str = Form(...),
    razorpay_payment_id: str = Form(...),
    razorpay_signature: str = Form(...),
    credits: int = Form(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return verify_credit_payment(
        db,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        credits,
        user
    )