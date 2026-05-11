from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.memory import MemoryType

class MemoryBase(BaseModel):
    title: str
    description: Optional[str] = None
    memory_type: MemoryType = MemoryType.PHOTO
    file_url: Optional[str] = None
    event_date: Optional[datetime] = None
    tags: Optional[str] = None

class MemoryCreate(MemoryBase):
    pass

class MemoryInDB(MemoryBase):
    id: int
    family_id: int
    uploaded_by: int
    ai_caption: Optional[str] = None
    ai_story: Optional[str] = None
    emotion_tag: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class Memory(MemoryInDB):
    pass
