from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.database_models import AlertModel, TransactionModel
from app.database.database import get_db

router = APIRouter(prefix="/api", tags=["Alerts"])

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(AlertModel).order_by(AlertModel.created_at.desc()).all()
    result = []
    for a in alerts:
        tx = db.query(TransactionModel).filter(TransactionModel.transaction_id == a.transaction_id).first()
        result.append({
            "id": a.alert_id,
            "transaction_id": a.transaction_id,
            "customer_id": a.customer_id,
            "amount": tx.amount if tx else 0.0,
            "location": tx.location if tx else "Location",
            "device_id": tx.device_id if tx else "DEV1",
            "risk_score": a.risk_score,
            "risk_level": a.risk_level,
            "decision": tx.decision if tx else ("ALERT" if a.risk_level == "HIGH" else "REVIEW"),
            "status": a.status or "UNREVIEWED",
            "created_at": a.created_at.isoformat()
        })
    return result
