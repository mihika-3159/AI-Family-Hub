from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import User, Memory
from app.schemas.memory import Memory as MemorySchema, MemoryCreate
from app.core.security import get_current_user
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/", response_model=List[MemorySchema])
def get_memories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    return db.query(Memory).filter(Memory.family_id == current_user.family_id).order_by(Memory.event_date.desc()).all()

@router.post("/", response_model=MemorySchema)
async def create_memory(request: MemoryCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="User must belong to a family")
    
    # Generate AI story
    story = await ai_service.get_memory_story(
        request.title, 
        request.description or "", 
        request.memory_type, 
        str(request.event_date)
    )
    
    new_memory = Memory(
        **request.model_dump(),
        family_id=current_user.family_id,
        uploaded_by=current_user.id,
        ai_story=story
    )
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory
