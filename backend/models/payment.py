from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from ..db.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    amount = Column(Float, nullable=False)
    credits = Column(Integer, nullable=True)

    razorpay_order_id = Column(String(150), nullable=True)
    razorpay_payment_id = Column(String(150), nullable=True)

    type = Column(String(50), nullable=False)
    status = Column(String(50), default="success")

    created_at = Column(DateTime, default=datetime.utcnow)