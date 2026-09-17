from app.config import settings

class RiskEngineService:
    @staticmethod
    def calculate_risk(fraud_prob: float, anomaly_score: float) -> dict:
        """
        Aggregates XGBoost fraud probability (60%) and Isolation Forest anomaly score (40%)
        into a 0-100 risk score and routes decision.
        """
        raw_score = (fraud_prob * settings.XGB_WEIGHT + anomaly_score * settings.IF_WEIGHT) * 100
        risk_score = min(100, max(0, int(round(raw_score))))

        if risk_score >= settings.HIGH_RISK_THRESHOLD:
            risk_level = "HIGH"
            decision = "ALERT"
        elif risk_score >= settings.MEDIUM_RISK_THRESHOLD:
            risk_level = "MEDIUM"
            decision = "REVIEW"
        else:
            risk_level = "LOW"
            decision = "PROCEED"

        return {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "decision": decision
        }
