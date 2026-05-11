from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import User, WellnessEntry
from app.schemas.wellness import WellnessEntry as WellnessSchema, WellnessCreate
from app.core.security import get_current_user
from app.services.ai_service import ai_service
import json

router = APIRouter()

@router.get("/", response_model=List[WellnessSchema])
def get_wellness_entries(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(WellnessEntry).filter(WellnessEntry.user_id == current_user.id).order_by(WellnessEntry.date.desc()).all()

@router.post("/", response_model=WellnessSchema)
async def create_wellness_entry(request: WellnessCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Generate AI insight
    history = db.query(WellnessEntry).filter(WellnessEntry.user_id == current_user.id).order_by(WellnessEntry.date.desc()).limit(5).all()
    history_str = json.dumps([{"mood": e.mood_score, "stress": e.stress_level} for e in history])
    current_str = request.model_dump_json()
    
    insight = await ai_service.get_wellness_insight(history_str, current_str)
    
    new_entry = WellnessEntry(
        **request.model_dump(),
        user_id=current_user.id,
        ai_insight=insight
    )
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry
