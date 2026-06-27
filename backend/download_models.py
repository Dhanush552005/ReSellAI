import os
import gdown

from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "ml_models"
MODEL_DIR.mkdir(exist_ok=True)

load_dotenv(BASE_DIR / ".env")

MODELS = {
    "yolo.pt": os.getenv("YOLO_FILE_ID"),
    "cnn_model.h5": os.getenv("CNN_FILE_ID"),
    "xgboost_resale_model.pkl": os.getenv("XGB_FILE_ID"),
}
def download_models():
    for filename, file_id in MODELS.items():
        destination = MODEL_DIR / filename

        if destination.exists():
            print(f"✅ {filename} already exists.")
            continue

        print(f"⬇ Downloading {filename}...")

        url = f"https://drive.google.com/uc?id={file_id}"

        gdown.download(
            url,
            str(destination),
            quiet=False
        )

        print(f"✅ Downloaded {filename}")