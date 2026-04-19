from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime

from ..db.database import Base


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)

    damage = Column(String(100), nullable=False)
    cnn_score = Column(Float, nullable=False)
    ml_score = Column(Float, nullable=False)
    price = Column(Float, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow)