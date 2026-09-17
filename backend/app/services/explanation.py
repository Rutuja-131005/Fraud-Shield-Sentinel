from typing import List

class ExplanationService:
    @staticmethod
    def generate_reasons(
        amount: float,
        customer_avg_amount: float,
        is_new_device: bool,
        hour: int,
        transactions_last_10min: int,
        location: str
    ) -> List[str]:
        """
        Generates human-readable explainability reasons for why the transaction was flagged.
        """
        reasons = []

        if amount > customer_avg_amount * 3:
            reasons.append("Transaction amount is significantly above customer baseline")

        if is_new_device:
            reasons.append("New device detected")

        if hour < 6 or hour > 23:
            reasons.append("Unusual transaction time")

        if transactions_last_10min > 4:
            reasons.append("High transaction velocity")

        if location and location.lower() not in ["pune"]:
            reasons.append("Unusual location")

        if not reasons:
            reasons.append("Normal transaction parameters within user profile limits")

        return reasons
