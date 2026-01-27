from fastapi import APIRouter, Form, Depends, HTTPException
import razorpay

from ..core.security import get_current_user
from ..db.mongo import users_col
from ..env import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

router = APIRouter(prefix="/payments", tags=["Payments"])

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


@router.post("/create-credit-order")
def create_credit_order(
    credits: int = Form(...),
    user=Depends(get_current_user)
):
    amount_map = {
        5: 5000,
        10: 9000,
        20: 15000
    }

    if credits not in amount_map:
        raise HTTPException(status_code=400, detail="Invalid credit pack")

    order = razorpay_client.order.create({
        "amount": amount_map[credits],
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "order_id": order["id"],
        "amount": amount_map[credits],
        "credits": credits,
        "key": RAZORPAY_KEY_ID
    }


@router.post("/verify-credit-payment")
def verify_credit_payment(
    razorpay_order_id: str = Form(...),
    razorpay_payment_id: str = Form(...),
    razorpay_signature: str = Form(...),
    credits: int = Form(...),
    user=Depends(get_current_user),
):
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })
    except:
        raise HTTPException(status_code=400, detail="Payment verification failed")

    users_col.update_one(
        {"_id": user["_id"]},
        {"$inc": {"credits": credits}}
    )

    updated_user = users_col.find_one({"_id": user["_id"]})

    return {
        "message": "Credits added successfully",
        "new_credits": updated_user["credits"]
    }
