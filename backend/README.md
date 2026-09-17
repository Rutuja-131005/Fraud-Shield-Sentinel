# FraudShield AI — Backend Service

Real-time, explainable AI fraud-risk detection & operations backend built with Python, FastAPI, XGBoost, Isolation Forest, and SQLAlchemy.

---

## 🏗️ Architecture Overview

```
                        ┌──────────────────────┐
                        │   FastAPI Gateway    │
                        │      /predict        │
                        └──────────┬───────────┘
                                   │
                                   ▼
                   ┌───────────────────────────────┐
                   │     FEATURE ENGINEERING       │
                   │ Amount Ratio / Z-Score / Time │
                   │ Velocity / Device / Location  │
                   └──────────────┬────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
             ┌──────────────┐           ┌──────────────┐
             │   XGBoost    │           │   Isolation  │
             │ Known Fraud  │           │    Forest    │
             └──────┬───────┘           └──────┬───────┘
                    │                           │
                    └─────────────┬─────────────┘
                                  ▼
                        ┌───────────────────┐
                        │   RISK ENGINE     │
                        │ 60% XGB + 40% IF  │
                        └─────────┬─────────┘
                                  │
                                  ▼
                        ┌───────────────────┐
                        │ DECISION ENGINE   │
                        │ LOW / MED / HIGH  │
                        └───────────────────┘
```

---

## 🚀 Quick Start Instructions

### 1. Create Virtual Environment & Install Dependencies

```bash
cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Run the FastAPI Backend Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The interactive OpenAPI / Swagger documentation will be available at:
`http://localhost:8000/docs`

### 3. Run Real-time Transaction Simulator

In a second terminal window:

```bash
python simulate_transactions.py
```

---

## ⚙️ Environment Variables (`.env`)

```env
PORT=8000
HOST=0.0.0.0
DATABASE_URL=sqlite:///./fraudshield.db
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173","*"]
HIGH_RISK_THRESHOLD=70
MEDIUM_RISK_THRESHOLD=40
XGBOOST_WEIGHT=0.60
ISOLATION_FOREST_WEIGHT=0.40
```

---

## 📡 API Contract & Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/predict` | Analyzes transaction payload and returns score, risk level, decision, and reasons |
| `GET` | `/api/transactions` | Retrieves list of all ingested transactions |
| `GET` | `/api/transactions/{id}` | Retrieves details for a specific transaction |
| `GET` | `/api/alerts` | Retrieves High & Medium risk alert queue |
| `GET` | `/api/customers/{id}` | Retrieves customer 90-day baseline and transaction history |
| `POST` | `/api/feedback` | Records analyst investigation feedback (`MARK_LEGITIMATE`, `CONFIRM_FRAUD`, etc.) |
| `GET` | `/api/metrics` | Retrieves ML model diagnostics and benchmark precision/recall metrics |
| `GET` | `/api/health` | Health check endpoint |

---

## 🧪 Example Curl Requests

### 1. Predict High-Risk Transaction

```bash
curl -X POST "http://localhost:8000/api/predict" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "C1001",
    "amount": 45000,
    "merchant": "Electronics Superstore",
    "location": "Mumbai",
    "device_id": "DEV999",
    "is_new_device": true,
    "hour": 3,
    "transactions_last_10min": 8
  }'
```

### 2. Submit Analyst Feedback

```bash
curl -X POST "http://localhost:8000/api/feedback" \
  -H "Content-Type: application/json" \
  -d '{
    "transaction_id": "TX-90214-MUM",
    "action": "MARK_LEGITIMATE",
    "comment": "Confirmed customer made high-value electronics purchase."
  }'
```

---

## 🔗 How to Connect the React Frontend

To connect the React frontend to this FastAPI backend:

1. Create or set the following in the frontend `.env`:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
2. Start the FastAPI backend on port `8000`.
3. Start the Vite dev server on port `3000`:
   ```bash
   npm run dev
   ```
4. The frontend central API client (`/src/services/api.ts`) will automatically detect the FastAPI backend health and connect seamlessly!
