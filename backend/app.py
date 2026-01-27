from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.auth import router as auth_router
from .api.predict import router as predict_router
from .api.payments import router as payments_router
from .api.marketplace import router as marketplace_router

app = FastAPI(title="ReSellAI - Mobile Resale Backend")

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(payments_router)
app.include_router(marketplace_router)

@app.get("/")
def home():
    return {"message": "ReSellAI Backend Running"}