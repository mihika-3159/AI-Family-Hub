from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.models import User
from app.core.security import get_current_user
from app.services.ai_service import ai_service
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import Task, Memory, WellnessEntry
import json

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: str = ""

@router.post("/chat")
async def chat(request: ChatRequest, current_user: User = Depends(get_current_user)):
    user_context = f"User is {current_user.full_name}, role: {current_user.role}. "
    if current_user.is_senior:
        user_context += "User is a senior citizen. "
    
    response = await ai_service.chat_with_assistant(request.message, user_context + request.context)
    return {"response": response}

@router.get("/safety-tips")
async def get_safety_tips(topic: str, audience: str = "family"):
    tips = await ai_service.get_safety_tips(topic, audience)
    return {"tips": tips}

@router.get("/weekly-summary")
async def get_weekly_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return {"summary": "You don't have a family setup yet! Join or create one to get weekly summaries."}
    
    # Fetch some data to provide context
    tasks = db.query(Task).filter(Task.family_id == current_user.family_id).limit(10).all()
    memories = db.query(Memory).filter(Memory.family_id == current_user.family_id).limit(5).all()
    wellness = db.query(WellnessEntry).filter(WellnessEntry.user_id == current_user.id).limit(5).all()
    
    data_summary = {
        "tasks": [{"title": t.title, "completed": t.is_completed} for t in tasks],
        "memories": [{"title": m.title} for m in memories],
        "wellness_avg_mood": sum([w.mood_score for w in wellness]) / len(wellness) if wellness else "No data"
    }
    
    response = await ai_service.get_weekly_summary(json.dumps(data_summary))
    return {"summary": response}
