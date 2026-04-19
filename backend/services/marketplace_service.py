import os
import razorpay

from fastapi import HTTPException
from dotenv import load_dotenv

from ..repositories.phone_repository import (
    get_all_phones,
    get_phone_by_id,
    get_user_phones,
    update_phone
)

load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")

razorpay_client = razorpay.Client(
    auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)
)


def view_marketplace(db):
    phones = get_all_phones(db)

    result = []

    for phone in phones:
        result.append({
            "_id": str(phone.id),
            "seller_id": str(phone.seller_id),
            "buyer_id": str(phone.buyer_id) if phone.buyer_id else None,
            "image_path": phone.image_path,
            "brand": phone.brand,
            "ram": phone.ram,
            "storage": phone.storage,
            "age": phone.age,
            "damage": phone.damage,
            "price": phone.price,
            "status": phone.status
        })

    return result


def mark_phone_sold(db, phone_id, user):
    phone = get_phone_by_id(db, int(phone_id))

    if not phone:
        raise HTTPException(
            status_code=404,
            detail="Phone not found"
        )

    if phone.seller_id != user.id:
        raise HTTPException(
            status_code=403,
            detail="Not your listing"
        )

    if phone.status == "sold":
        raise HTTPException(
            status_code=400,
            detail="Already sold"
        )

    phone.status = "sold"
    update_phone(db)

    return {
        "message": "Phone marked as sold"
    }


def create_phone_order(db, phone_id, user):
    phone = get_phone_by_id(db, int(phone_id))

    if not phone:
        raise HTTPException(
            status_code=404,
            detail="Phone not found"
        )

    if phone.seller_id == user.id:
        raise HTTPException(
            status_code=403,
            detail="You cannot buy your own phone"
        )

    if phone.status != "on_sale":
        raise HTTPException(
            status_code=400,
            detail="Phone not available"
        )

    amount = int(phone.price * 100)

    order = razorpay_client.order.create({
        "amount": amount,
        "currency": "INR",
        "payment_capture": 1
    })

    return {
        "order_id": order["id"],
        "amount": amount,
        "phone_id": phone_id,
        "key": RAZORPAY_KEY_ID
    }


def verify_phone_payment(
    db,
    phone_id,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
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

    phone = get_phone_by_id(db, int(phone_id))

    if not phone:
        raise HTTPException(
            status_code=404,
            detail="Phone not found"
        )

    if phone.seller_id == user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot buy your own phone"
        )

    if phone.status != "on_sale":
        raise HTTPException(
            status_code=400,
            detail="Already sold"
        )

    phone.status = "sold"
    phone.buyer_id = user.id

    update_phone(db)

    return {
        "message": "Phone purchased successfully"
    }


def get_my_listings(db, user):
    phones = get_user_phones(db, user.id)

    result = []

    for phone in phones:
        result.append({
            "_id": str(phone.id),
            "seller_id": str(phone.seller_id),
            "buyer_id": str(phone.buyer_id) if phone.buyer_id else None,
            "image_path": phone.image_path,
            "brand": phone.brand,
            "ram": phone.ram,
            "storage": phone.storage,
            "age": phone.age,
            "damage": phone.damage,
            "price": phone.price,
            "status": phone.status
        })

    return result