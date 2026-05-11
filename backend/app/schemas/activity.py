from pydantic import BaseModel
from typing import Optional
from app.models.activity import ActivityType

class ActivityBase(BaseModel):
    title: str
    description: Optional[str] = None
    activity_type: ActivityType = ActivityType.INDOOR
    duration_minutes: Optional[int] = None
    budget_estimate: Optional[float] = None
    min_age: int = 0
    max_age: int = 100

class ActivityCreate(ActivityBase):
    pass

class ActivityUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    activity_type: Optional[ActivityType] = None
    is_favorite: Optional[bool] = None
    rating: Optional[int] = None

class ActivityInDB(ActivityBase):
    id: int
    family_id: int
    is_ai_generated: bool
    is_favorite: bool
    rating: Optional[int] = None

    class Config:
        from_attributes = True

class Activity(ActivityInDB):
    pass
