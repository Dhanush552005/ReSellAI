from fastapi import APIRouter, Form, Depends
from sqlalchemy.orm import Session

from ..db.session import get_db
from ..core.security import get_current_user
from ..services.auth_service import (
    register_user,
    login_user
)

router = APIRouter(
    prefix="/auth",
    tags=["Auth"]
)


@router.post("/register")
def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    return register_user(
        db,
        username,
        email,
        password
    )


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
    db: Session = Depends(get_db)
):
    return login_user(
        db,
        email,
        password
    )


@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "_id": str(user.id),
        "username": user.username,
        "email": user.email,
        "credits": user.credits
    }