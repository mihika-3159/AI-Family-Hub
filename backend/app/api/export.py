from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models import User, Task, Memory, WellnessEntry, Activity
from app.core.security import get_current_user
import json
from datetime import datetime
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/summary")
def get_family_summary(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return {"error": "No family found"}
    
    tasks = db.query(Task).filter(Task.family_id == current_user.family_id).all()
    memories = db.query(Memory).filter(Memory.family_id == current_user.family_id).all()
    wellness = db.query(WellnessEntry).filter(WellnessEntry.user_id == current_user.id).all()
    activities = db.query(Activity).filter(Activity.family_id == current_user.family_id).all()

    summary = {
        "family_name": current_user.family.name,
        "export_date": str(datetime.utcnow()),
        "stats": {
            "total_tasks": len(tasks),
            "completed_tasks": len([t for t in tasks if t.is_completed]),
            "total_memories": len(memories),
            "wellness_entries": len(wellness),
            "total_activities": len(activities)
        },
        "details": {
            "tasks": [{"title": t.title, "status": "completed" if t.is_completed else "pending"} for t in tasks],
            "memories": [{"title": m.title, "date": str(m.event_date)} for m in memories]
        }
    }
    
    return summary
