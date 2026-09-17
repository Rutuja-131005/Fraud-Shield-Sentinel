from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.models.database_models import TransactionModel
from app.database.database import get_db

router = APIRouter(prefix="/api", tags=["Transactions"])

@router.get("/transactions")
def get_transactions(db: Session = Depends(get_db)):
    txs = db.query(TransactionModel).order_by(TransactionModel.created_at.desc()).all()
    result = []
    for tx in txs:
        reasons_list = [r.strip() for r in tx.reasons.split(";")] if tx.reasons else []
        result.append({
            "id": tx.transaction_id,
            "transaction_id": tx.transaction_id,
            "customer_id": tx.customer_id,
            "amount": tx.amount,
            "merchant": tx.merchant,
            "location": tx.location,
            "device_id": tx.device_id,
            "is_new_device": tx.is_new_device,
            "timestamp": tx.created_at.isoformat(),
            "created_at": tx.created_at.isoformat(),
            "fraud_probability": tx.fraud_probability,
            "anomaly_score": tx.anomaly_score,
            "risk_score": tx.risk_score,
            "risk_level": tx.risk_level,
            "decision": tx.decision,
            "reasons": reasons_list,
            "investigation_status": tx.investigation_status or "UNREVIEWED",
            "analyst_comment": tx.analyst_comment
        })
    return result

@router.get("/transactions/{transaction_id}")
def get_transaction(transaction_id: str, db: Session = Depends(get_db)):
    tx = db.query(TransactionModel).filter(
        (TransactionModel.transaction_id == transaction_id) | (TransactionModel.id == transaction_id)
    ).first()

    if not tx:
        raise HTTPException(status_code=404, detail="Transaction not found")

    reasons_list = [r.strip() for r in tx.reasons.split(";")] if tx.reasons else []
    return {
        "id": tx.transaction_id,
        "transaction_id": tx.transaction_id,
        "customer_id": tx.customer_id,
        "amount": tx.amount,
        "merchant": tx.merchant,
        "location": tx.location,
        "device_id": tx.device_id,
        "is_new_device": tx.is_new_device,
        "timestamp": tx.created_at.isoformat(),
        "created_at": tx.created_at.isoformat(),
        "fraud_probability": tx.fraud_probability,
        "anomaly_score": tx.anomaly_score,
        "risk_score": tx.risk_score,
        "risk_level": tx.risk_level,
        "decision": tx.decision,
        "reasons": reasons_list,
        "investigation_status": tx.investigation_status or "UNREVIEWED",
        "analyst_comment": tx.analyst_comment
    }
