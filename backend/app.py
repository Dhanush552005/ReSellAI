import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .download_models import download_models
print("STEP 1")
download_models()
print("STEP 2")
from .db.database import Base, engine
print("STEP 3")
from .models import (
    user,
    phone,
    payment,
    prediction
)

Base.metadata.create_all(bind=engine)

print("STEP 4")
from .api.auth import router as auth_router
print("STEP 5")

from .api.predict import router as predict_router
print("STEP 6")

from .api.payments import router as payments_router
print("STEP 7")

from .api.marketplace import router as marketplace_router
print("STEP 8")

from .ai_support.routes import router as support_router
print("STEP 9")
app = FastAPI(
    title="ReSellAI - Mobile Resale Backend"
)
app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", "")
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(payments_router)
app.include_router(marketplace_router)
app.include_router(support_router)


@app.get("/")
def home():
    return {
        "message": "ReSellAI Backend Running"
    }
