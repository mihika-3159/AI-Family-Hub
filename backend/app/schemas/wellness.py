from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WellnessBase(BaseModel):
    mood_score: Optional[int] = None
    mood_emoji: Optional[str] = None
    energy_level: Optional[int] = None
    sleep_hours: Optional[float] = None
    water_glasses: Optional[int] = None
    exercise_minutes: Optional[int] = None
    stress_level: Optional[int] = None
    notes: Optional[str] = None
    medication_taken: Optional[str] = None
    date: datetime

class WellnessCreate(WellnessBase):
    pass

class WellnessInDB(WellnessBase):
    id: int
    user_id: int
    ai_insight: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class WellnessEntry(WellnessInDB):
    pass
