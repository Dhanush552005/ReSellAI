from pydantic import BaseModel


class SellPredictionSchema(BaseModel):
    image_path: str
    brand: str
    ram: int
    storage: int
    age: int
    damage: str
    price: float