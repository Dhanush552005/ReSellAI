from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

from ..db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    credits = Column(Integer, default=5)
    created_at = Column(DateTime, default=datetime.utcnow)