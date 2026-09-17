class FeatureEngineeringService:
    @staticmethod
    def extract_features(
        customer_id: str,
        amount: float,
        customer_avg_amount: float = 2500.0,
        is_new_device: bool = False,
        hour: int = 12,
        transactions_last_10min: int = 1
    ) -> dict:
        """
        Extracts synthetic behavioral features comparing transaction parameters
        against customer 90-day baseline.
        """
        # Amount Ratio
        baseline_avg = customer_avg_amount if customer_avg_amount > 0 else 2500.0
        amount_ratio = amount / baseline_avg
        
        # Approximate Z-Score
        amount_std = baseline_avg * 0.4
        amount_z_score = (amount - baseline_avg) / (amount_std if amount_std > 0 else 1.0)
        
        # Velocity Spike Indicator
        is_high_velocity = transactions_last_10min > 4
        
        # Time Anomaly (Night hours 00:00 - 05:00)
        is_night_time = hour < 6 or hour > 23

        return {
            "amount_ratio": round(amount_ratio, 2),
            "amount_z_score": round(amount_z_score, 2),
            "is_new_device": is_new_device,
            "is_high_velocity": is_high_velocity,
            "is_night_time": is_night_time,
            "transactions_last_10min": transactions_last_10min
        }
