# 📱 ReSellAI – AI-Powered Mobile Resale Valuation System

ReSellAI is an end-to-end **Artificial Intelligence system** that accurately estimates the **resale value of smartphones** by analyzing **screen damage** and **device specifications** using **Computer Vision and Machine Learning**.

The system integrates **YOLO-based screen detection**, **CNN-based damage classification**, and a **Machine Learning resale scoring model**, all exposed through a **FastAPI backend** and consumed by a modern **React frontend**.

---

## 🚀 Key Features

- 📸 Upload a smartphone image
- 🔍 Automatic **phone screen detection** using YOLO
- 🧠 **Damage severity classification** using CNN  
  *(No Broken / Light / Moderate / Severe)*
- 📊 **Machine Learning-based resale scoring**
- 💰 Intelligent resale price calculation
- 🌐 Full-stack implementation (FastAPI + React)
- 🎨 Modern glassmorphism UI

---

## 🧠 System Workflow


---

## 🧩 Technology Stack

### Backend
- Python
- FastAPI
- PyTorch
- Ultralytics YOLO
- XGBoost

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

### AI / ML Models
- YOLO – Object Detection (screen detection)
- CNN (MobileNetV2) – Damage classification
- Machine Learning model – Resale score prediction

---

## 📂 Project Structure

- User Image + Device Details
- ↓
- YOLO – Phone Screen Detection
- ↓
- CNN – Damage Severity Classification
- ↓
- ML Model – Resale Scoring
- ↓
- Price Engine
- ↓
- Final Resale Price

---

## 🧩 Technology Stack

### Backend
- Python
- FastAPI
- PyTorch
- Ultralytics YOLO
- XGBoost

### Frontend
- React (Vite)
- Tailwind CSS
- Framer Motion

### AI / ML Models
- YOLO – Object Detection (screen detection)
- CNN (MobileNetV2) – Damage classification
- Machine Learning model – Resale score prediction

---


## 🧪 Model Overview

### YOLO – Screen Detection
- Detects and crops the phone screen from the uploaded image
- Prevents invalid or unrelated images from being processed

### CNN – Damage Classification
- Damage classes:
  - `no_broken`
  - `light_broken`
  - `moderately_broken`
  - `severe_broken`
- Outputs:
  - Damage class
  - Confidence score

### ML Model – Resale Scoring
- Inputs:
  - RAM
  - Storage
  - Device Age
  - Brand
  - Body Condition
- Output:
  - Resale probability score (range: 0–1)

---


### Factors Explanation

- **Base factor (0.8)**  
  Standard depreciation applied to all resale devices.

- **Damage weight**
  - No Broken → 1.00
  - Light Broken → 0.85
  - Moderate Broken → 0.65
  - Severe Broken → 0.45


---

## 🔌 API Endpoint

### `POST /predict`

#### Input Parameters
- Phone image
- MRP
- RAM
- Storage
- Age
- Brand
- Body condition (broken / not broken)

#### Sample Response
```json
{
"status": "accepted",
"damage": "moderately_broken",
"cnn_score": 0.78,
"ml_score": 0.83,
"resale_price": 18600
}




