import os
from pathlib import Path
import gdown

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "ml_models"

MODEL_DIR.mkdir(parents=True, exist_ok=True)

MODELS = {
    "yolo.pt": "10GiihatLuBQapwUMBKMbZ4mcxZqjwX90",
    "cnn_model.h5": "1n7iMgzsT5-ppmNxY2WKLPbixi-T6oSzS",
    "xgboost_resale_model.pkl": "1DPQC_0mATwrII0I9UR8ZgpCdGcajaiKi",
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