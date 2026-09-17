from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.database_models import CustomerModel, TransactionModel
from app.database.database import get_db

router = APIRouter(prefix="/api", tags=["Customers"])

@router.get("/customers/{customer_id}")
def get_customer(customer_id: str, db: Session = Depends(get_db)):
    customer = db.query(CustomerModel).filter(CustomerModel.customer_id == customer_id).first()
    if not customer:
        # Default mock customer C1001 if not found
        customer = CustomerModel(
            customer_id=customer_id,
            name="Rahul Sharma",
            average_amount=2500.0,
            normal_locations="Pune, Mumbai",
            known_devices="DEV001, DEV002",
            typical_transaction_time="09:00 - 22:00",
            transaction_frequency="3.4 tx/day"
        )

    txs = db.query(TransactionModel).filter(TransactionModel.customer_id == customer_id).all()
    recent_txs = []
    for tx in txs:
        recent_txs.append({
            "id": tx.transaction_id,
            "transaction_id": tx.transaction_id,
            "customer_id": tx.customer_id,
            "amount": tx.amount,
            "merchant": tx.merchant,
            "location": tx.location,
            "device_id": tx.device_id,
            "risk_score": tx.risk_score,
            "risk_level": tx.risk_level,
            "decision": tx.decision,
            "investigation_status": tx.investigation_status or "UNREVIEWED",
            "created_at": tx.created_at.isoformat()
        })

    return {
        "customer_id": customer.customer_id,
        "name": customer.name,
        "average_amount": customer.average_amount,
        "normal_locations": [loc.strip() for loc in customer.normal_locations.split(",")],
        "known_devices": [dev.strip() for dev in customer.known_devices.split(",")],
        "typical_transaction_time": customer.typical_transaction_time,
        "transaction_frequency": customer.transaction_frequency,
        "risk_tier": "Low Risk" if customer.average_amount < 10000 else "Moderate Risk",
        "recent_transactions": recent_txs,
        "baseline_history": [
            {"date": "Sep 10", "amount": 1500, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 11", "amount": 2200, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 12", "amount": 3100, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 13", "amount": 2700, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 14", "amount": 1800, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 15", "amount": 2400, "baseline": customer.average_amount, "is_anomaly": False},
            {"date": "Sep 16", "amount": 45000, "baseline": customer.average_amount, "is_anomaly": True}
        ]
    }

@router.get("/customers/{customer_id}/history")
def get_customer_history(customer_id: str, db: Session = Depends(get_db)):
    txs = db.query(TransactionModel).filter(TransactionModel.customer_id == customer_id).all()
    return txs
