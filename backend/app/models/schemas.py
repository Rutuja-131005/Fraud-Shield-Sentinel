from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PredictRequest(BaseModel):
    customer_id: str = Field(..., example="C1001")
    amount: float = Field(..., example=45000)
    merchant: Optional[str] = Field("Electronics Superstore", example="Electronics Superstore")
    location: Optional[str] = Field("Mumbai", example="Mumbai")
    device_id: Optional[str] = Field("DEV999", example="DEV999")
    is_new_device: Optional[bool] = Field(True, example=True)
    hour: Optional[int] = Field(3, example=3)
    transactions_last_10min: Optional[int] = Field(8, example=8)

class PredictResponse(BaseModel):
    transaction_id: str
    customer_id: str
    amount: float
    merchant: str
    location: str
    device_id: str
    fraud_probability: float
    anomaly_score: float
    risk_score: int
    risk_level: str
    decision: str
    reasons: List[str]
    created_at: str
    investigation_status: str = "UNREVIEWED"

class FeedbackRequest(BaseModel):
    transaction_id: str
    action: str = Field(..., example="MARK_LEGITIMATE") # INVESTIGATE, MARK_LEGITIMATE, CONFIRM_FRAUD, ESCALATE
    comment: Optional[str] = Field(None, example="Customer confirmed transaction")

class FeedbackResponse(BaseModel):
    success: bool = True
    message: str = "Feedback recorded successfully"
    transaction_id: str
    action: str
    comment: Optional[str] = None
    investigation_status: str

class MetricsResponse(BaseModel):
    precision: float
    recall: float
    f1: float
    pr_auc: float
    false_positive_rate: float
    false_negative_rate: float
    transaction_count: int
    high_risk_count: int
    average_risk_score: float
    supervised_model: str = "XGBoost Classifier v2.1"
    anomaly_model: str = "Isolation Forest v1.4"
    last_trained_at: Optional[str] = None

class AlertSchema(BaseModel):
    id: str
    transaction_id: str
    customer_id: str
    amount: float
    risk_score: int
    risk_level: str
    status: str
    created_at: str

class CustomerSchema(BaseModel):
    customer_id: str
    name: str
    average_amount: float
    normal_locations: List[str]
    known_devices: List[str]
    typical_transaction_time: str
    transaction_frequency: str
