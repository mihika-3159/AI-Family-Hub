from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import User, Task
from app.schemas.task import Task as TaskSchema, TaskCreate, TaskUpdate
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[TaskSchema])
def get_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    return db.query(Task).filter(Task.family_id == current_user.family_id).all()

@router.post("/", response_model=TaskSchema)
def create_task(request: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="User must belong to a family to create tasks")
    
    new_task = Task(
        **request.model_dump(),
        family_id=current_user.family_id,
        creator_id=current_user.id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.patch("/{task_id}", response_model=TaskSchema)
def update_task(task_id: int, request: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id, Task.family_id == current_user.family_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    
    db.commit()
    db.refresh(task)
    return task
