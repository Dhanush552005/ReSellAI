from pydantic import BaseModel


class UserResponse(BaseModel):
    _id: str
    username: str
    email: str
    credits: int


class UserBasicResponse(BaseModel):
    _id: str
    username: str