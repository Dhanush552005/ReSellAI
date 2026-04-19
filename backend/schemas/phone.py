from pydantic import BaseModel
from typing import Optional


class PhoneResponse(BaseModel):
    _id: str
    seller_id: str
    buyer_id: Optional[str] = None

    image_path: str

    brand: str
    ram: int
    storage: int
    age: int

    damage: str
    price: float
    status: str


class PhoneCreateSchema(BaseModel):
    image_path: str
    brand: str
    ram: int
    storage: int
    age: int
    damage: str
    price: float