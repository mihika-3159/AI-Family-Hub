from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str
    role: UserRole = UserRole.PARENT
    is_senior: bool = False
    age: Optional[int] = None
    avatar_color: str = "#6C63FF"

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[UserRole] = None
    is_senior: Optional[bool] = None
    age: Optional[int] = None
    avatar_color: Optional[str] = None
    onboarding_completed: Optional[bool] = None

class UserInDB(UserBase):
    id: int
    family_id: Optional[int] = None
    is_active: bool
    onboarding_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class User(UserInDB):
    pass
