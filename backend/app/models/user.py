"""AI Family Hub - User Model"""
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin
import enum


class UserRole(str, enum.Enum):
    ADMIN = "admin"
    PARENT = "parent"
    CHILD = "child"
    ELDER = "elder"
    CAREGIVER = "caregiver"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.PARENT, nullable=False)
    avatar_color = Column(String(7), default="#6C63FF")
    is_active = Column(Boolean, default=True)
    is_senior = Column(Boolean, default=False)
    age = Column(Integer, nullable=True)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=True)
    onboarding_completed = Column(Boolean, default=False)

    # Relationships
    family = relationship("Family", back_populates="members")
    notifications = relationship("Notification", back_populates="user")
    tasks = relationship("Task", back_populates="assignee", foreign_keys="Task.assignee_id")
    created_tasks = relationship("Task", back_populates="creator", foreign_keys="Task.creator_id")
    wellness_entries = relationship("WellnessEntry", back_populates="user")
    memories = relationship("Memory", back_populates="uploaded_by_user")
