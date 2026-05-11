from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.models.user import User
from app.models.family import Family
from app.schemas.family import Family as FamilySchema, FamilyCreate, FamilyUpdate
from app.core.security import get_current_user
import random
import string

router = APIRouter()

def generate_invite_code():
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))

@router.post("/", response_model=FamilySchema)
def create_family(request: FamilyCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.family_id:
        raise HTTPException(status_code=400, detail="User already belongs to a family")
    
    new_family = Family(
        name=request.name,
        motto=request.motto,
        avatar_emoji=request.avatar_emoji,
        invite_code=generate_invite_code()
    )
    db.add(new_family)
    db.commit()
    db.refresh(new_family)
    
    # Assign user to family
    current_user.family_id = new_family.id
    db.commit()
    
    return new_family

@router.post("/join/{invite_code}", response_model=FamilySchema)
def join_family(invite_code: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    family = db.query(Family).filter(Family.invite_code == invite_code.upper()).first()
    if not family:
        raise HTTPException(status_code=404, detail="Invalid invite code")
    
    current_user.family_id = family.id
    db.commit()
    db.refresh(family)
    return family

@router.get("/my", response_model=FamilySchema)
def get_my_family(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        raise HTTPException(status_code=404, detail="User does not belong to a family")
    return current_user.family
