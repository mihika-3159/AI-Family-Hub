from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MedicationBase(BaseModel):
    name: str
    dosage: Optional[str] = None
    frequency: str
    time_of_day: Optional[str] = None
    instructions: Optional[str] = None

class MedicationCreate(MedicationBase):
    user_id: int

class MedicationUpdate(BaseModel):
    name: Optional[str] = None
    dosage: Optional[str] = None
    frequency: Optional[str] = None
    time_of_day: Optional[str] = None
    instructions: Optional[str] = None

class Medication(MedicationBase):
    id: int
    user_id: int
    family_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
