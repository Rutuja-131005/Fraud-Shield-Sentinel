from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class CustomerModel(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    average_amount = Column(Float, default=2500.0)
    normal_locations = Column(String, default="Pune, Mumbai")
    known_devices = Column(String, default="DEV001, DEV002")
    typical_transaction_time = Column(String, default="09:00 - 22:00")
    transaction_frequency = Column(String, default="3.4 tx/day")
    created_at = Column(DateTime, default=datetime.utcnow)

    transactions = relationship("TransactionModel", back_populates="customer")

class TransactionModel(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True, nullable=False)
    customer_id = Column(String, ForeignKey("customers.customer_id"), nullable=False)
    amount = Column(Float, nullable=False)
    merchant = Column(String, default="Merchant")
    location = Column(String, default="Location")
    device_id = Column(String, default="DEV1")
    is_new_device = Column(Boolean, default=False)
    hour = Column(Integer, default=12)
    transactions_last_10min = Column(Integer, default=1)
    
    fraud_probability = Column(Float, nullable=False)
    anomaly_score = Column(Float, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False) # LOW, MEDIUM, HIGH
    decision = Column(String, nullable=False)   # PROCEED, REVIEW, ALERT
    reasons = Column(Text, nullable=True)        # JSON string or comma-separated
    
    # SEPARATED Investigation Status (Does not change risk score)
    investigation_status = Column(String, default="UNREVIEWED") # UNREVIEWED, INVESTIGATING, CLEARED, CONFIRMED_FRAUD, ESCALATED
    analyst_comment = Column(Text, nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    customer = relationship("CustomerModel", back_populates="transactions")
    alerts = relationship("AlertModel", back_populates="transaction")
    feedback = relationship("FeedbackModel", back_populates="transaction")

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(String, unique=True, index=True, nullable=False)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"), nullable=False)
    customer_id = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)
    risk_level = Column(String, nullable=False)
    status = Column(String, default="UNREVIEWED")
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("TransactionModel", back_populates="alerts")

class FeedbackModel(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, ForeignKey("transactions.transaction_id"), nullable=False)
    action = Column(String, nullable=False) # INVESTIGATE, MARK_LEGITIMATE, CONFIRM_FRAUD, ESCALATE
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship("TransactionModel", back_populates="feedback")
