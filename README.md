# 📱 ReSellAI – AI Mobile Resale & Marketplace Platform


**ReSellAI** is a production-grade **AI-powered mobile phone resale marketplace** that combines computer vision, machine learning, and cloud payments to create a trustworthy P2P trading platform. The platform accurately estimates phone resale values through damage analysis and device specifications, while providing automated customer support via RAG (Retrieval-Augmented Generation).

**Core Value Proposition**: Remove pricing uncertainty in phone resales through AI-powered damage detection, intelligent valuation, and policy-driven customer support.

---

## 🚀 Key Features

### 🎯 Core Features
- **📸 AI Phone Valuation**
  - YOLO v8 screen detection (73% accuracy)
  - ResNet50 CNN damage classification (82% accuracy)
  - XGBoost device scoring with depreciation modeling
  - End-to-end inference: **41.8ms per image**

- **💰 Intelligent Dynamic Pricing**
  - Hybrid depreciation + AI scoring formula
  - Real-time market-based adjustments
  - Damage-weighted price calculations
  - Confidence-based price adjustments

- **🛒 Verified P2P Marketplace**
  - Browse available phones with damage classifications
  - Secure buyer/seller transactions
  - Payment verification via Razorpay
  - Status tracking (on_sale → sold)

- **💳 Credit-Based System**
  - 1 credit = 1 phone valuation
  - Flexible credit packages: 5 (₹50), 10 (₹90), 20 (₹150)
  - Razorpay payment integration
  - Automatic credit deduction on valuation

- **🤖 RAG-Based Customer Support**
  - Multi-agent issue resolution pipeline
  - FAISS vector retrieval from 8 policy documents
  - Groq LLaMA-powered response generation
  - Structured compliance-ready decisions

- **🔐 Enterprise Security**
  - JWT-based authentication
  - bcrypt password hashing
  - Razorpay signature verification
  - Role-based access control (buyer/seller)

---

## 🏗️ System Architecture

```
┌─────────────────────────────┐
│  Frontend (React + Vite)    │
│  localhost:5173             │
│  (Tailwind CSS, Framer)     │
└──────────────┬──────────────┘
               │ HTTPS REST API
┌──────────────▼──────────────────────────┐
│         FastAPI Backend                 │
│         localhost:8000                  │
│  ┌──────────────────────────────────┐   │
│  │  API Routes                      │   │
│  │  ├─ /auth (JWT)                 │   │
│  │  ├─ /predict (AI Valuation)     │   │
│  │  ├─ /marketplace (P2P Trading)  │   │
│  │  ├─ /payments (Razorpay)        │   │
│  │  └─ /support (RAG Support)      │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  AI/ML Pipeline                 │   │
│  │  ├─ YOLO v8 (Screen Detection)  │   │
│  │  ├─ ResNet50 CNN (Damage Class) │   │
│  │  ├─ XGBoost (Device Scoring)    │   │
│  │  └─ Price Engine (Valuation)    │   │
│  └──────────────────────────────────┘   │
│  ┌──────────────────────────────────┐   │
│  │  RAG Support System             │   │
│  │  ├─ Groq LLaMA 3.1 (LLM)        │   │
│  │  ├─ FAISS (Vector DB)           │   │
│  │  └─ Policy Documents (8 types)  │   │
│  └──────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ SQL / Vector Queries
┌──────────────┴──────────────┐
│                             │
│  MySQL Database      FAISS Vector DB
│  ├─ Users           ├─ Policy Docs
│  ├─ Phones          └─ Embeddings
│  ├─ Predictions
│  └─ Payments
```

---

## 🧪 Machine Learning Models Performance

| Component | Model Type | Accuracy | Inference Time | Status |
|-----------|-----------|----------|-----------------|--------|
| **Screen Detection** | YOLOv8 (PyTorch) | 73% | 12ms | ✅ Production |
| **Damage Classification** | ResNet50 CNN | 82% | 18ms | ✅ Production |
| **Device Scoring** | XGBoost Regression | Real-valued (0-1) | 11.8ms | ✅ Production |
| **Full Pipeline** | Optimized Inference | - | **41.8ms** | ✅ Production |

### Model Specifications

**🎯 YOLO v8 – Screen Detection**
- Framework: PyTorch (Ultralytics)
- Model: `ml_models/yolo.pt`
- Confidence Threshold: 0.73
- Input: Variable resolution images
- Output: Bounding box coordinates (x, y, w, h)
- Use Case: Isolate phone screen region before damage analysis

**🧠 ResNet50 CNN – Damage Classification**
- Framework: TensorFlow/Keras
- Model: `ml_models/cnn_model.h5`
- Input Shape: 224 × 224 RGB images
- Output: 4-class probability distribution
  - `no_broken` (0% damage)
  - `light_broken` (<30% damage)
  - `moderately_broken` (30-70% damage)
  - `severe_broken` (>70% damage)
- Training Data: Synthetic dataset with balanced class distribution

**📊 XGBoost – Device Scoring**
- Framework: XGBoost (sklearn compatible)
- Model: `ml_models/xgboost_resale_model.pkl`
- Input Features: 
  - RAM (GB): 2, 4, 6, 8, 12
  - Storage (GB): 32, 64, 128, 256, 512
  - Age (years): 0-5
  - Body Damage (binary): yes/no
  - Brand (categorical): Apple, OnePlus, Redmi, Samsung, Xiaomi
- Output: ML Score (0-1) representing device quality
- Training Data: Synthetic resale dataset (`Datasets/mobile_resale_synthetic_dataset_v2.csv`)

---

## 💰 Valuation Logic & Pricing Formula

The platform uses a **hybrid depreciation + AI scoring** approach for stable, realistic pricing.

### 🔹 Pricing Components

| Component | Formula | Purpose |
|-----------|---------|---------|
| **Base Depreciation** | `0.8 × MRP` | Standard resale baseline (80% of retail) |
| **Damage Weight** | See table below | Applies damage severity penalty |
| **Confidence Factor** | `0.5 + (0.5 × CNN_Confidence)` | Adjusts for CNN model certainty |
| **ML Factor** | `0.7 + (0.3 × ML_Score)` | Incorporates device specifications |

### 📉 Damage Weight Multipliers (CNN Output)

| Damage Class | Multiplier | Impact |
|-------------|-----------|--------|
| No Broken | 1.00 | No penalty |
| Light Broken | 0.85 | -15% depreciation |
| Moderately Broken | 0.65 | -35% depreciation |
| Severe Broken | 0.45 | -55% depreciation |

### 🧮 Final Resale Price Formula

```
Resale Price = MRP × 0.8 × DamageWeight × ConfidenceFactor × MLFactor

Example:
  Phone MRP: ₹30,000
  Damage: Light Broken (CNN confidence: 0.92)
  Device Score: 0.85 (good specs)
  
  Price = 30,000 × 0.8 × 0.85 × (0.5 + 0.5×0.92) × (0.7 + 0.3×0.85)
        = 30,000 × 0.8 × 0.85 × 0.96 × 0.955
        ≈ ₹18,760 (estimated resale value)
```

---

## 🛠️ Technology Stack

### Backend
- **Language**: Python 3.10+
- **Framework**: FastAPI 0.104+
- **Database**: MySQL 8.0+ with SQLAlchemy ORM
- **ML/Vision**: 
  - PyTorch (YOLO v8)
  - TensorFlow/Keras (ResNet50)
  - XGBoost (Device Scoring)
- **RAG**: 
  - LangChain
  - FAISS (Vector Search)
  - Hugging Face Transformers (`sentence-transformers/all-MiniLM-L6-v2`)
- **LLM API**: Groq (LLaMA 3.1 8B Instant)
- **Payments**: Razorpay Python SDK
- **Auth**: python-jose (JWT), bcrypt (password hashing)

### Frontend
- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS + PostCSS
- **UI Animations**: Framer Motion
- **Icons**: Lucide React
- **Build**: Vite with Hot Module Replacement (HMR)

### Infrastructure & DevOps
- **Storage**: Local file system (`/uploads` directory)
- **Vector DB**: FAISS (pre-built index)
- **Payment Gateway**: Razorpay (PCI-DSS compliant)
- **LLM Backend**: Groq API (cloud-hosted)

---


## 🔄 Core Workflows

### Workflow 1: Phone Valuation (Main Feature)

```
1. User uploads phone image + device specs (brand, RAM, storage, age, body damage)
   └─→ Deduct 1 credit from user account

2. YOLO v8 Screen Detection
   └─→ If confidence > 0.73: Extract screen region
   └─→ Else: Return "Phone screen not detected" error

3. ResNet50 CNN Damage Classification
   └─→ Classify damage: no_broken | light | moderate | severe
   └─→ Output: damage_class + CNN_confidence (0-1)

4. XGBoost Device Scoring
   └─→ Score device: (RAM, storage, age, brand, body_damage) → ML_score (0-1)

5. Price Engine Calculation
   └─→ Apply formula: Price = MRP × 0.8 × damage_weight × confidence_factor × ml_factor

6. Save Prediction Record
   └─→ Store in database: user_id, damage, cnn_score, ml_score, price

7. Return Valuation Result
   └─→ Display to user: damage assessment + estimated resale price

8. [Optional] User lists phone in marketplace
   └─→ Creates Phone listing with status=on_sale
```

**Performance**: 41.8ms per image (GPU-optimized)

---

### Workflow 2: Marketplace Purchase & Sale

```
Buyer Flow:
  1. Browse /marketplace/buy → View phones with status=on_sale
  2. See: brand, specs, condition, estimated price
  3. Click "Buy" → Backend creates Razorpay order
  4. Complete payment in Razorpay UI
  5. Razorpay notifies backend (webhook)
  6. Backend verifies signature
  7. Update phone: buyer_id=buyer, status=sold
  8. Transaction complete

Seller Flow:
  1. List phone from prediction or manual entry
  2. Phone appears in marketplace with status=on_sale
  3. When buyer purchases: Receive notification
  4. Optionally mark as "Sold" when physically handed over
  5. Can view "My Listings" → active + sold history
```

---

### Workflow 3: Credit Top-up

```
User Flow:
  1. Check account: credits remaining
  2. If credits = 0: Cannot make predictions
  3. Visit /credits page
  4. Select credit package:
     - 5 credits → ₹50
     - 10 credits → ₹90
     - 20 credits → ₹150
  5. Click "Buy" → Razorpay payment flow
  6. Complete payment
  7. Backend verifies signature
  8. Credits added to account
  9. User can now make predictions again
```

---

### Workflow 4: RAG-Based Customer Support

```
Support Pipeline:
  1. User submits ticket: "Phone arrived with cracked screen"
  2. Groq Triage Agent:
     └─→ Check: Is this phone-related? ✓ Yes
  
  3. Classification Agent:
     └─→ Issue type: "damaged_on_delivery"
  
  4. Retriever Agent:
     └─→ FAISS search: Retrieve top-3 relevant policies
     └─→ Policies: Damages, Disputes, Claims handling
  
  5. Generator Agent:
     └─→ Groq LLaMA generates structured response:
         {
           "classification": "Damaged on Delivery",
           "clarifying_questions": ["..."],
           "decision": "approve",
           "rationale": "Policy #08 allows refunds for items damaged on delivery",
           "citations": ["08-disputes-damaged-incorrect-items.md"],
           "customer_response": "We'll process your refund...",
           "next_steps": ["Contact support", "Return item", "Receive credit"]
         }
  
  6. Compliance Agent:
     └─→ Validate all required fields present
     └─→ Escalate if incomplete
  
  7. Return response to user

Performance: <2 seconds per ticket
```

---

## 🚀 Installation & Setup

### Prerequisites
- Python 3.10+
- Node.js 18+ & npm
- MySQL 8.0+
- Groq API key (LLM support)
- Razorpay API keys (payments)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirement.txt

# Create .env file
cat > .env << EOF
DATABASE_URL=mysql+pymysql://root:password@localhost/resellai
JWT_SECRET_KEY=your_secret_key_here
GROQ_API_KEY=your_groq_api_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
EOF

# Run database migrations (tables auto-created on startup)
python app.py
```

**Server starts at**: `http://localhost:8000`

---

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:8000
EOF

# Start development server
npm run dev
```

**UI available at**: `http://localhost:5173`

---

## ⚙️ Configuration

### Backend Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | MySQL connection string | `mysql+pymysql://user:pass@localhost/db` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `your_secret_here` |
| `JWT_ALGORITHM` | JWT encoding algorithm | `HS256` |
| `JWT_EXPIRATION_HOURS` | Token expiry (hours) | `24` |
| `GROQ_API_KEY` | Groq API key for LLM | `gsk_xxx` |
| `RAZORPAY_KEY_ID` | Razorpay merchant ID | `rzp_live_xxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key | `xxx` |
| `UPLOAD_DIR` | Image upload directory | `./uploads` |
| `CORS_ORIGINS` | Allowed CORS origins | `["http://localhost:5173"]` |

### Frontend Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API base URL |

---

## 📊 Model Training & Validation

### YOLO v8 Screen Detection
```bash
# Training dataset: dataset_yolov8/
# Classes: 1 (phone_screen)
# Format: YOLO (.txt labels with normalized coordinates)
# Accuracy: 73% on test set
```

### ResNet50 CNN Damage Classification
```bash
# Training dataset: cnn_dataset_split/
# Classes: 4 (no_broken, light_broken, moderately_broken, severe_broken)
# Input: 224×224 RGB images
# Accuracy: 82% on test set
# Framework: TensorFlow/Keras
```

### XGBoost Device Scoring
```bash
# Training dataset: mobile_resale_synthetic_dataset_v2.csv
# Features: RAM, storage, age, brand, body_damage, MRP
# Target: resale_price (normalized 0-1)
# Framework: XGBoost
```

---

## 🔒 Security Considerations

✅ **Authentication**: JWT tokens with 24-hour expiration  
✅ **Password Security**: bcrypt hashing (rounds: 12)  
✅ **Payment Verification**: Razorpay signature validation  
✅ **Data Access**: Role-based control (buyer/seller separation)  
✅ **Image Storage**: Secure `/uploads` directory with access logs  
✅ **API Rate Limiting**: Recommended for production deployment  
✅ **HTTPS**: Use in production (TLS 1.2+)  
✅ **CORS**: Configured for localhost (update for production)  

---

## 📈 Performance Metrics

| Metric | Value | Target |
|--------|-------|--------|
| AI Valuation End-to-End | 41.8ms | <50ms ✅ |
| Screen Detection | 12ms | <20ms ✅ |
| Damage Classification | 18ms | <25ms ✅ |
| Device Scoring | 11.8ms | <15ms ✅ |
| Database Query (avg) | <5ms | <10ms ✅ |
| Support Ticket Resolution | <2s | <5s ✅ |
| API Response Time (p95) | <200ms | <500ms ✅ |


---

## Acknowledgments

- YOLOv8 by Ultralytics
- ResNet by Microsoft Research
- XGBoost by Distributed ML Community
- Groq for LLM inference
- Razorpay for payments infrastructure

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




