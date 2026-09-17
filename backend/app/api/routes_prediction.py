from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.schemas import PredictRequest, PredictResponse
from app.models.database_models import TransactionModel, CustomerModel, AlertModel
from app.database.database import get_db
from app.services.feature_engineering import FeatureEngineeringService
from app.services.fraud_model import xgboost_service
from app.services.anomaly_model import isolation_forest_service
from app.services.risk_engine import RiskEngineService
from app.services.explanation import ExplanationService
import datetime, json, random

router = APIRouter(prefix="/api", tags=["Prediction"])

@router.post("/predict", response_model=PredictResponse)
def predict_transaction(req: PredictRequest, db: Session = Depends(get_db)):
    # 1. Fetch Customer baseline or default fallback
    customer = db.query(CustomerModel).filter(CustomerModel.customer_id == req.customer_id).first()
    customer_avg_amount = customer.average_amount if customer else 2500.0

    # 2. Extract Features
    features = FeatureEngineeringService.extract_features(
        customer_id=req.customer_id,
        amount=req.amount,
        customer_avg_amount=customer_avg_amount,
        is_new_device=req.is_new_device or False,
        hour=req.hour or 12,
        transactions_last_10min=req.transactions_last_10min or 1
    )

    # 3. XGBoost Supervised Fraud Probability
    fraud_prob = xgboost_service.predict_probability(features)

    # 4. Isolation Forest Anomaly Score
    anomaly_score = isolation_forest_service.predict_anomaly_score(features)

    # 5. Risk Aggregation & Decision Engine
    risk_info = RiskEngineService.calculate_risk(fraud_prob, anomaly_score)

    # 6. Human Readable Explainability Reasons
    reasons = ExplanationService.generate_reasons(
        amount=req.amount,
        customer_avg_amount=customer_avg_amount,
        is_new_device=req.is_new_device or False,
        hour=req.hour or 12,
        transactions_last_10min=req.transactions_last_10min or 1,
        location=req.location or "Pune"
    )

    tx_id = f"TX-{random.randint(10000, 99999)}-FASTAPI"
    created_at = datetime.datetime.utcnow().isoformat()

    # 7. Persist Transaction Record
    tx = TransactionModel(
        transaction_id=tx_id,
        customer_id=req.customer_id,
        amount=req.amount,
        merchant=req.merchant or "Merchant",
        location=req.location or "Pune",
        device_id=req.device_id or "DEV999",
        is_new_device=req.is_new_device or False,
        hour=req.hour or 12,
        transactions_last_10min=req.transactions_last_10min or 1,
        fraud_probability=fraud_prob,
        anomaly_score=anomaly_score,
        risk_score=risk_info["risk_score"],
        risk_level=risk_info["risk_level"],
        decision=risk_info["decision"],
        reasons="; ".join(reasons),
        investigation_status="UNREVIEWED",
        created_at=datetime.datetime.utcnow()
    )
    db.add(tx)
    db.commit()

    # 8. Create Alert if High or Medium Risk
    if risk_info["risk_level"] in ["HIGH", "MEDIUM"]:
        alert = AlertModel(
            alert_id=f"ALT-{tx_id.replace('TX-', '')}",
            transaction_id=tx_id,
            customer_id=req.customer_id,
            risk_score=risk_info["risk_score"],
            risk_level=risk_info["risk_level"],
            status="UNREVIEWED",
            created_at=datetime.datetime.utcnow()
        )
        db.add(alert)
        db.commit()

    return PredictResponse(
        transaction_id=tx_id,
        customer_id=req.customer_id,
        amount=req.amount,
        merchant=req.merchant or "Merchant",
        location=req.location or "Pune",
        device_id=req.device_id or "DEV999",
        fraud_probability=fraud_prob,
        anomaly_score=anomaly_score,
        risk_score=risk_info["risk_score"],
        risk_level=risk_info["risk_level"],
        decision=risk_info["decision"],
        reasons=reasons,
        created_at=created_at,
        investigation_status="UNREVIEWED"
    )
