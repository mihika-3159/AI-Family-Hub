"""AI Family Hub - Medication Model"""
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Time
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin


class Medication(Base, TimestampMixin):
    __tablename__ = "medications"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=True)
    frequency = Column(String(100), nullable=False)  # e.g., "Daily", "Weekly", "Every 4 hours"
    time_of_day = Column(String(100), nullable=True) # e.g., "08:00, 20:00"
    instructions = Column(Text, nullable=True)
    
    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="medications")
    family = relationship("Family", back_populates="medications")
