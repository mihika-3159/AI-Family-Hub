"""AI Family Hub - JWT Security & Password Hashing"""
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.db.session import get_db

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
import hashlib
import base64
import bcrypt

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Pre-hash with SHA-256 to support passwords > 72 chars
    sha256_hash = hashlib.sha256(plain_password.encode()).digest()
    b64_hash = base64.b64encode(sha256_hash)
    try:
        return bcrypt.checkpw(b64_hash, hashed_password.encode())
    except Exception:
        return False


def get_password_hash(password: str) -> str:
    # Pre-hash with SHA-256 to support passwords > 72 chars
    sha256_hash = hashlib.sha256(password.encode()).digest()
    b64_hash = base64.b64encode(sha256_hash)
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(b64_hash, salt).decode()


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    from app.models.user import User
    user = db.query(User).filter(User.id == int(user_id)).first()
    if user is None:
        raise credentials_exception
    return user
