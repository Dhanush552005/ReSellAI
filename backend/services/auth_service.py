from fastapi import HTTPException

from ..models.user import User
from ..core.security import (
    hash_password,
    verify_password,
    create_access_token
)

from ..repositories.user_repository import (
    get_user_by_email,
    get_user_by_username,
)


def register_user(db, username, email, password):
    existing_email = get_user_by_email(db, email)

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = get_user_by_username(db, username)

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    user = User(
        username=username,
        email=email,
        hashed_password=hash_password(password),
        credits=5
    )

    from ..repositories.user_repository import create_user
    create_user(db, user)

    return {
        "message": "User registered successfully"
    }


def login_user(db, email, password):
    user = get_user_by_email(db, email)

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not verify_password(
        password,
        user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    token = create_access_token({
        "sub": str(user.id)
    })

    return {
        "access_token": token,
        "token_type": "bearer"
    }