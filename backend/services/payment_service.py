import os
import razorpay

from fastapi import HTTPException
from dotenv import load_dotenv

from ..models.payment import Payment

from ..repositories.payment_repository import create_payment
from ..repositories.user_repository import update_user

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


def create_credit_order(credits):
    amount_map = {
        5: 5000,
        10: 9000,
        20: 15000
    }

    if credits not in amount_map:
        raise HTTPException(
            status_code=400,
            detail="Invalid credit pack"
        )

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


def verify_credit_payment(
    db,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    credits,
    user
):
    try:
        razorpay_client.utility.verify_payment_signature({
            "razorpay_order_id": razorpay_order_id,
            "razorpay_payment_id": razorpay_payment_id,
            "razorpay_signature": razorpay_signature
        })

    except:
        raise HTTPException(
            status_code=400,
            detail="Payment verification failed"
        )

    user.credits += credits
    update_user(db)

    payment = Payment(
        user_id=user.id,
        amount=0,
        credits=credits,
        razorpay_order_id=razorpay_order_id,
        razorpay_payment_id=razorpay_payment_id,
        type="credit_pack",
        status="success"
    )

    create_payment(db, payment)

    return {
        "message": "Credits added successfully",
        "new_credits": user.credits
    }