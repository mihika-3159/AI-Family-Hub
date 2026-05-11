from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.schemas.user import User

class FamilyBase(BaseModel):
    name: str
    motto: Optional[str] = None
    avatar_emoji: str = "🏠"

class FamilyCreate(FamilyBase):
    pass

class FamilyUpdate(BaseModel):
    name: Optional[str] = None
    motto: Optional[str] = None
    avatar_emoji: Optional[str] = None

class FamilyInDB(FamilyBase):
    id: int
    invite_code: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Family(FamilyInDB):
    members: List[User] = []
