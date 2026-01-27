from fastapi import APIRouter, Form, HTTPException, Depends  
from bson import ObjectId

from ..core.security import hash_password, verify_password, create_access_token, get_current_user
from ..db.mongo import users_col

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(
    username: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
):
    existing_email = users_col.find_one({"email": email})
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")

    existing_username = users_col.find_one({"username": username})
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    user = {
        "username": username,
        "email": email,
        "hashed_password": hash_password(password),
        "credits": 5,
        "created_at": ObjectId().generation_time,
    }

    users_col.insert_one(user)

    return {"message": "User registered successfully"}


@router.post("/login")
def login(
    email: str = Form(...),
    password: str = Form(...),
):
    user = users_col.find_one({"email": email})

    if not user or not verify_password(password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user["email"]})

    return {"access_token": token, "token_type": "bearer"}

@router.get("/me")
def get_me(user=Depends(get_current_user)):
    return {
        "_id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "credits": user["credits"]
    }

