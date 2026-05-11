from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.task import TaskPriority, TaskCategory

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    category: TaskCategory = TaskCategory.CHORE
    is_recurring: bool = False
    recurrence_rule: Optional[str] = None
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    assignee_id: Optional[int] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    category: Optional[TaskCategory] = None
    is_completed: Optional[bool] = None
    is_recurring: Optional[bool] = None
    recurrence_rule: Optional[str] = None
    due_date: Optional[datetime] = None
    assignee_id: Optional[int] = None

class TaskInDB(TaskBase):
    id: int
    family_id: int
    creator_id: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    streak_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class Task(TaskInDB):
    pass
