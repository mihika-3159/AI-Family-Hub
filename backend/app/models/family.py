"""AI Family Hub - Family Model"""
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin


class Family(Base, TimestampMixin):
    __tablename__ = "families"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    invite_code = Column(String(20), unique=True, index=True)
    motto = Column(String(500), nullable=True)
    avatar_emoji = Column(String(10), default="🏠")

    # Relationships
    members = relationship("User", back_populates="family")
    tasks = relationship("Task", back_populates="family")
    memories = relationship("Memory", back_populates="family")
    activities = relationship("Activity", back_populates="family")
    medications = relationship("Medication", back_populates="family")
