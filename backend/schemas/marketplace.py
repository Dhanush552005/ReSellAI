from pydantic import BaseModel


class VerifyPhonePaymentSchema(BaseModel):
    phone_id: str
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str