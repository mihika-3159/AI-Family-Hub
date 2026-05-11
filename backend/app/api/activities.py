from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import User, Activity
from app.schemas.activity import Activity as ActivitySchema, ActivityCreate, ActivityUpdate
from app.core.security import get_current_user
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/", response_model=List[ActivitySchema])
def get_activities(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    return db.query(Activity).filter(Activity.family_id == current_user.family_id).all()

@router.post("/suggest")
async def suggest_activities(time: int, budget: float, interests: str, current_user: User = Depends(get_current_user)):
    # In a real app, we'd pass more context about members
    members_summary = f"Family with {current_user.role} role member"
    suggestions = await ai_service.get_activity_suggestions(members_summary, time, budget, interests)
    return {"suggestions": suggestions}

@router.post("/", response_model=ActivitySchema)
def save_activity(request: ActivityCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="User must belong to a family")
    
    new_activity = Activity(
        **request.model_dump(),
        family_id=current_user.family_id
    )
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity
