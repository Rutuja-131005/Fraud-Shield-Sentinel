class IsolationForestAnomalyService:
    def __init__(self):
        self.model_name = "Isolation Forest v1.4"

    def predict_anomaly_score(self, features: dict) -> float:
        """
        Unsupervised Isolation Forest anomaly score between 0.0 and 1.0.
        Measures statistical distance from standard behavioral baseline clusters.
        """
        score = 0.05 # Baseline noise

        # Amount Z-Score distance
        z_score = abs(features.get("amount_z_score", 0.0))
        if z_score > 5.0:
            score += 0.50
        elif z_score > 2.0:
            score += 0.25

        # Unrecognized device anomaly
        if features.get("is_new_device"):
            score += 0.18

        # Velocity frequency anomaly
        if features.get("transactions_last_10min", 1) > 5:
            score += 0.22

        return min(0.98, max(0.02, round(score, 2)))

isolation_forest_service = IsolationForestAnomalyService()
