from sqlalchemy.orm import Session
from app.models.database_models import CustomerModel, TransactionModel, AlertModel, Base
from app.database.database import engine, SessionLocal
import datetime

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Check if already seeded
    if db.query(CustomerModel).count() > 0:
        db.close()
        return

    print("[Seed] Initializing seed database records...")

    # Seed Customer C1001 (Rahul Sharma)
    c1001 = CustomerModel(
        customer_id="C1001",
        name="Rahul Sharma",
        average_amount=2500.0,
        normal_locations="Pune, Mumbai",
        known_devices="DEV001, DEV002",
        typical_transaction_time="09:00 - 22:00",
        transaction_frequency="3.4 tx/day"
    )

    # Seed Customer C1002 (Priya Patel)
    c1002 = CustomerModel(
        customer_id="C1002",
        name="Priya Patel",
        average_amount=8200.0,
        normal_locations="Bengaluru, Chennai",
        known_devices="DEV003, DEV004",
        typical_transaction_time="08:00 - 20:00",
        transaction_frequency="5.1 tx/day"
    )

    db.add_all([c1001, c1002])
    db.commit()

    # Seed Normal Transaction
    tx_normal = TransactionModel(
        transaction_id="TX-77102-PUN",
        customer_id="C1001",
        amount=1250.0,
        merchant="Starbucks Coffee",
        location="Pune",
        device_id="DEV001",
        is_new_device=False,
        hour=14,
        transactions_last_10min=1,
        fraud_probability=0.04,
        anomaly_score=0.08,
        risk_score=12,
        risk_level="LOW",
        decision="PROCEED",
        reasons="Normal transaction amount within customer baseline, Recognized trusted device",
        investigation_status="CLEARED",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
    )

    # Seed Suspicious Transaction (HIGH Risk Demo)
    tx_suspicious = TransactionModel(
        transaction_id="TX-90214-MUM",
        customer_id="C1001",
        amount=45000.0,
        merchant="Electronics Superstore",
        location="Mumbai",
        device_id="DEV999",
        is_new_device=True,
        hour=3,
        transactions_last_10min=8,
        fraud_probability=0.91,
        anomaly_score=0.87,
        risk_score=94,
        risk_level="HIGH",
        decision="ALERT",
        reasons="Transaction amount is significantly above customer baseline, New device detected, Unusual transaction time, High transaction velocity",
        investigation_status="UNREVIEWED",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
    )

    db.add_all([tx_normal, tx_suspicious])
    db.commit()

    # Seed Alert for Suspicious Transaction
    alert = AlertModel(
        alert_id="ALT-90214-MUM",
        transaction_id="TX-90214-MUM",
        customer_id="C1001",
        risk_score=94,
        risk_level="HIGH",
        status="UNREVIEWED",
        created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=5)
    )

    db.add(alert)
    db.commit()
    db.close()
    print("[Seed] Seed database records populated successfully.")

if __name__ == "__main__":
    seed_database()
