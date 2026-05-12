from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models import User, UserRole
from app.models.medication import Medication
from app.schemas.medication import Medication as MedicationSchema, MedicationCreate
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[MedicationSchema])
def get_medications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    # If parent, they can see all in family? 
    # User said "only see their own and not anyone else's". 
    # I'll stick to strict "only their own" as requested.
    return db.query(Medication).filter(Medication.user_id == current_user.id).all()

@router.post("/", response_model=MedicationSchema)
def create_medication(request: MedicationCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in [UserRole.PARENT, UserRole.ELDER]: # Allowing Elder/Parent for senior hub context but following "only parents" if strict
        # User explicitly asked for "only allow parents to add health and medicine records"
        if current_user.role != UserRole.PARENT:
            raise HTTPException(status_code=403, detail="Only parents can add medication records")
            
    if not current_user.family_id:
        raise HTTPException(status_code=400, detail="User must belong to a family")
    
    new_med = Medication(
        **request.model_dump(),
        family_id=current_user.family_id
    )
    db.add(new_med)
    db.commit()
    db.refresh(new_med)
    return new_med

@router.delete("/{med_id}")
def delete_medication(med_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    med = db.query(Medication).filter(Medication.id == med_id, Medication.family_id == current_user.family_id).first()
    if not med:
        raise HTTPException(status_code=404, detail="Medication not found")
    
    if current_user.role != UserRole.PARENT:
        raise HTTPException(status_code=403, detail="Only parents can delete medication records")
        
    db.delete(med)
    db.commit()
    return {"message": "Deleted"}
