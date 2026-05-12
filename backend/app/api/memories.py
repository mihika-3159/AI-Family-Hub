from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
import shutil
import os

from app.db.session import get_db
from app.models import User, Memory
from app.schemas.memory import Memory as MemorySchema
from app.core.security import get_current_user
from app.services.ai_service import ai_service

router = APIRouter()

@router.get("/", response_model=List[MemorySchema])
def get_memories(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    return db.query(Memory).filter(Memory.family_id == current_user.family_id).order_by(Memory.event_date.desc()).all()

@router.post("/", response_model=MemorySchema)
async def create_memory(
    title: str = Form(...),
    description: Optional[str] = Form(None),
    memory_type: str = Form("photo"),
    event_date: date = Form(default_factory=date.today),
    file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="User must belong to a family")
    
    file_path = None
    if file:
        # Create uploads directory if not exists
        os.makedirs("uploads", exist_ok=True)
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    
    # Generate AI story
    story = await ai_service.get_memory_story(
        title, 
        description or "", 
        memory_type, 
        str(event_date)
    )
    
    new_memory = Memory(
        title=title,
        description=description,
        memory_type=memory_type,
        event_date=event_date,
        attachment_url=file_path,
        family_id=current_user.family_id,
        uploaded_by=current_user.id,
        ai_story=story
    )
    db.add(new_memory)
    db.commit()
    db.refresh(new_memory)
    return new_memory
