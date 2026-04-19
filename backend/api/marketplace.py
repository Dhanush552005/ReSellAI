from fastapi import APIRouter, Depends, Form
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..core.security import get_current_user

from ..services.marketplace_service import (
    view_marketplace,
    mark_phone_sold,
    create_phone_order,
    verify_phone_payment,
    get_my_listings
)

router = APIRouter(
    prefix="/marketplace",
    tags=["Marketplace"]
)


@router.get("/buy")
def view_marketplace_route(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return view_marketplace(db)


@router.post("/mark-sold/{phone_id}")
def mark_sold(
    phone_id: str,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return mark_phone_sold(
        db,
        phone_id,
        user
    )


@router.post("/buy/create-order/{phone_id}")
def create_order(
    phone_id: str,
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return create_phone_order(
        db,
        phone_id,
        user
    )


@router.get("/my-listings")
def my_listings(
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return get_my_listings(
        db,
        user
    )


@router.post("/buy/verify-payment")
def verify_payment(
    phone_id: str = Form(...),
    razorpay_order_id: str = Form(...),
    razorpay_payment_id: str = Form(...),
    razorpay_signature: str = Form(...),
    user=Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return verify_phone_payment(
        db,
        phone_id,
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        user
    )