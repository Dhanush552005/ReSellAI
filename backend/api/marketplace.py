from fastapi import APIRouter, Form, Depends, HTTPException
from bson import ObjectId
import razorpay

from ..core.security import get_current_user
from ..db.mongo import phones_col
from ..env import RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET

router = APIRouter(prefix="/marketplace", tags=["Marketplace"])

razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))


@router.get("/buy")
def view_marketplace(user=Depends(get_current_user)):
    phones = phones_col.find()

    result = []
    for phone in phones:
        phone["_id"] = str(phone["_id"])
        phone["seller_id"] = str(phone["seller_id"])
        result.append(phone)

    return result

@router.post("/mark-sold/{phone_id}")
def mark_sold(
    phone_id: str,
    user=Depends(get_current_user),
):
    phone = phones_col.find_one({"_id": ObjectId(phone_id)})

    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")

    if phone["seller_id"] != user["_id"]:
        raise HTTPException(status_code=403, detail="Not your listing")

    if phone["status"] == "sold":
        raise HTTPException(status_code=400, detail="Already sold")

    phones_col.update_one(
        {"_id": ObjectId(phone_id)},
        {"$set": {"status": "sold"}}
    )

    return {"message": "Phone marked as sold"}

@router.post("/buy/create-order/{phone_id}")
def create_phone_order(phone_id: str, user=Depends(get_current_user)):
    phone = phones_col.find_one({"_id": ObjectId(phone_id)})

    if str(phone["seller_id"]) == str(user["_id"]):
        raise HTTPException(status_code=403, detail="You cannot buy your own phone")

    if not phone or phone["status"] != "on_sale":
        raise HTTPException(status_code=400, detail="Phone not available")

    if phone["seller_id"] == user["_id"]:
        raise HTTPException(status_code=400, detail="You cannot buy your own phone")

    amount = int(phone["price"] * 100)

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


@router.post("/buy/verify-payment")
def verify_phone_payment(
    phone_id: str = Form(...),
    razorpay_order_id: str = Form(...),
    razorpay_payment_id: str = Form(...),
    razorpay_signature: str = Form(...),
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

    phone = phones_col.find_one({"_id": ObjectId(phone_id)})

    if not phone:
        raise HTTPException(status_code=404, detail="Phone not found")

    if phone["seller_id"] == user["_id"]:
        raise HTTPException(status_code=400, detail="You cannot buy your own phone")

    if phone["status"] != "on_sale":
        raise HTTPException(status_code=400, detail="Already sold")

    phones_col.update_one(
        {"_id": ObjectId(phone_id)},
        {"$set": {"status": "sold", "buyer_id": user["_id"]}}
    )

    return {"message": "Phone purchased successfully"}