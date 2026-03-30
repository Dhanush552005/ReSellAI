from pydantic import BaseModel

class SupportRequest(BaseModel):
    ticket: str