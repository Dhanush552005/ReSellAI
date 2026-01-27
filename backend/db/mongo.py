from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL", "mongodb://127.0.0.1:27017")

client = MongoClient(MONGO_URL)

db = client["resellai"]

users_col = db["users"]
predictions_col = db["predictions"]
phones_col = db["phones"]
payments_col = db["payments"]
