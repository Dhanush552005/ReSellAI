from pydantic import BaseModel


class CreditOrderSchema(BaseModel):
    credits: int