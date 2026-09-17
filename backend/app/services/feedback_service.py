from sqlalchemy.orm import Session
from app.models.database_models import TransactionModel, FeedbackModel, AlertModel
import datetime

class FeedbackService:
    @staticmethod
    def record_feedback(
        db: Session,
        transaction_id: str,
        action: str,
        comment: str = None
    ) -> dict:
        """
        Records analyst feedback and updates Investigation Status while
        PRESERVING the original risk score and risk level unchanged!
        """
        tx = db.query(TransactionModel).filter(
            (TransactionModel.transaction_id == transaction_id) | (TransactionModel.id == transaction_id)
        ).first()

        new_status = "CLEARED"
        if action == "CONFIRM_FRAUD":
            new_status = "CONFIRMED_FRAUD"
        elif action == "INVESTIGATE":
            new_status = "INVESTIGATING"
        elif action == "ESCALATE":
            new_status = "ESCALATED"
        elif action == "MARK_LEGITIMATE":
            new_status = "CLEARED"

        if tx:
            tx.investigation_status = new_status
            if comment:
                tx.analyst_comment = comment
            tx.reviewed_at = datetime.datetime.utcnow()

            # Record feedback log
            fb = FeedbackModel(
                transaction_id=tx.transaction_id,
                action=action,
                comment=comment
            )
            db.add(fb)

            # Update Alert status if exists
            alert = db.query(AlertModel).filter(AlertModel.transaction_id == tx.transaction_id).first()
            if alert:
                alert.status = new_status

            db.commit()

        return {
            "success": True,
            "message": "Feedback recorded successfully",
            "transaction_id": transaction_id,
            "action": action,
            "comment": comment,
            "investigation_status": new_status
        }
