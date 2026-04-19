from sqlalchemy import Column, Integer, String, Float

from ..db.database import Base


class Phone(Base):
    __tablename__ = "phones"

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, nullable=False)
    buyer_id = Column(Integer, nullable=True)

    image_path = Column(String(255), nullable=False)

    brand = Column(String(100), nullable=False)
    ram = Column(Integer, nullable=False)
    storage = Column(Integer, nullable=False)
    age = Column(Integer, nullable=False)

    damage = Column(String(100), nullable=False)
    price = Column(Float, nullable=False)

    status = Column(String(50), default="on_sale")