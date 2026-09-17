from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.models.schemas import FeedbackRequest, FeedbackResponse
from app.database.database import get_db
from app.services.feedback_service import FeedbackService

router = APIRouter(prefix="/api", tags=["Feedback"])

@router.post("/feedback", response_model=FeedbackResponse)
def record_feedback(req: FeedbackRequest, db: Session = Depends(get_db)):
    result = FeedbackService.record_feedback(
        db=db,
        transaction_id=req.transaction_id,
        action=req.action,
        comment=req.comment
    )
    return FeedbackResponse(**result)
