from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from app.db.session import get_db
from app.models.user import User, UserRole
from app.schemas.auth import Token, RegisterRequest
from app.schemas.user import User as UserSchema, UserUpdate
from app.core.security import create_access_token, get_password_hash, verify_password, get_current_user
from app.core.config import get_settings
import random
import string

router = APIRouter()

@router.get("/members", response_model=List[UserSchema])
def get_family_members(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not current_user.family_id:
        return []
    return db.query(User).filter(User.family_id == current_user.family_id).all()
@router.patch("/members/{user_id}/role", response_model=UserSchema)
def update_member_role(user_id: int, new_role: UserRole, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != UserRole.PARENT:
        raise HTTPException(status_code=403, detail="Only parents can update roles")
    
    target_user = db.query(User).filter(User.id == user_id, User.family_id == current_user.family_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Member not found")
        
    target_user.role = new_role
    db.commit()
    db.refresh(target_user)
    return target_user

from app.models.family import Family

@router.post("/register", response_model=UserSchema)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user exists
    if db.query(User).filter(User.email == request.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.username == request.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    
    family_id = None
    if request.invite_code:
        family = db.query(Family).filter(Family.invite_code == request.invite_code).first()
        if not family:
            raise HTTPException(status_code=400, detail="Invalid invite code")
        family_id = family.id
    else:
        # Create a new family if no invite code
        new_family = Family(
            name=f"{request.full_name}'s Family",
            invite_code="".join(random.choices(string.ascii_uppercase + string.digits, k=8))
        )
        db.add(new_family)
        db.commit()
        db.refresh(new_family)
        family_id = new_family.id

    # Create user
    new_user = User(
        email=request.email,
        username=request.username,
        full_name=request.full_name,
        hashed_password=get_password_hash(request.password),
        is_senior=request.is_senior,
        role=UserRole.ELDER if request.is_senior else UserRole.PARENT,
        family_id=family_id
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=UserSchema)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.patch("/me", response_model=UserSchema)
def update_me(request: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    update_data = request.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user
