# 📱 ReSellAI – AI Powered Mobile Resale & Marketplace Platform

ReSellAI is an end-to-end **Artificial Intelligence ecosystem** that accurately estimates the **resale value of smartphones** by analyzing **screen damage** and **device specifications** using **Computer Vision and Machine Learning**. Beyond valuation, the platform provides a complete **P2P Marketplace** with integrated **Razorpay payments** and a **Credit-based system**.

The system integrates **YOLO-based screen detection**, **CNN-based damage classification**, and an **XGBoost resale scoring model**, all exposed through a **FastAPI backend** and consumed by a modern **React frontend**.

---

## 🚀 Key Features

- 📸 **AI Diagnostic**: Automatic phone screen detection using YOLO and damage severity classification (No/Light/Moderate/Severe) using CNN.
- 💰 **Intelligent Valuation**: Dynamic resale price calculation using an XGBoost ML model based on hardware specs, age, and AI damage scores.
- 🛒 **Verified Marketplace**: A peer-to-peer trading environment where owners can list devices and buyers can purchase verified stock.
- 🔐 **Secure Ownership**: Specialized logic ensuring only the real owner can mark a listing as "Sold".
- 💳 **Credit System**: Integrated Razorpay payment gateway for credit top-ups (1 credit per prediction) and direct marketplace transactions.
- 🎨 **Modern UI**: Professional glassmorphism interface with a dual-tab "On Sale" and "Sold" marketplace view.

---

## 🧠 System Workflow

- User Image + Device Details
- ↓
- YOLO – Phone Screen Detection
- ↓
- CNN – Damage Severity Classification
- ↓
- ML Model (XGBoost) – Resale Scoring
- ↓
- Price Engine (Final Resale Price)
- ↓
- Marketplace Listing & P2P Trade

---

## 🧩 Technology Stack

### Backend
- **Python / FastAPI**
- **PyTorch / Ultralytics YOLO**
- **XGBoost**
- **MongoDB** (Database)
- **Razorpay SDK** (Payments)

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React** (Icons)

---

## 🧪 Model Overview

### YOLO – Screen Detection
- Detects and crops the phone screen from the uploaded image.
- Prevents invalid or unrelated images from being processed.

### CNN – Damage Classification
- Damage classes: `no_broken`, `light_broken`, `moderately_broken`, `severe_broken`.
- Outputs damage class and confidence score.

### ML Model – Resale Scoring
- Inputs: RAM, Storage, Device Age, Brand, and AI damage outputs.
- Output: Resale probability score (range: 0–1).

---

## 💰 Valuation Logic

The final resale price is calculated using a hybrid approach that combines
business depreciation rules with AI model outputs for stable and realistic pricing.

### 🔹 Factors Used

- **Base Depreciation Factor (0.8)**  
  Standard depreciation applied to all resale devices.

- **Damage Weight (from CNN classification)**  
  - No Broken → 1.00  
  - Light Broken → 0.85  
  - Moderate Broken → 0.65  
  - Severe Broken → 0.45  

- **Confidence Factor (CNN certainty adjustment)**  
  Adjusts price based on model confidence:  
  `ConfidenceFactor = 0.5 + (0.5 × CNN_Confidence)`

- **ML Factor (XGBoost resale score calibration)**  
  Controls influence of ML prediction:  
  `MLFactor = 0.7 + (0.3 × ML_Score)`

---

### 🧮 Final Pricing Formula

```text
Resale Price =
MRP × BaseFactor × DamageWeight × ConfidenceFactor × MLFactor

---

## 🔌 Core API Endpoints

### `POST /predict`
- Runs the AI valuation pipeline (Image + Device Specs).

### `POST /marketplace/mark-sold/{phone_id}`
- Secured endpoint allowing owners to move items to the "Sold" tab.

### `POST /payments/verify-credit-payment`
- Verifies Razorpay signatures for credit top-ups.

---

## 📂 Project Structure

- `frontend/`: React components, Framer Motion animations, and API integration.
- `backend/`: FastAPI routes, AI model inference, and MongoDB connection.

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




