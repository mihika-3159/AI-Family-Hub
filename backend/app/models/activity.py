"""AI Family Hub - Activity Model"""
from sqlalchemy import Column, Integer, String, Boolean, Float, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin
import enum


class ActivityType(str, enum.Enum):
    INDOOR = "indoor"
    OUTDOOR = "outdoor"
    COOKING = "cooking"
    GAME = "game"
    LEARNING = "learning"
    CREATIVE = "creative"
    WELLNESS = "wellness"
    ADVENTURE = "adventure"


class Activity(Base, TimestampMixin):
    __tablename__ = "activities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    activity_type = Column(SQLEnum(ActivityType), default=ActivityType.INDOOR)
    duration_minutes = Column(Integer, nullable=True)
    budget_estimate = Column(Float, nullable=True)
    min_age = Column(Integer, default=0)
    max_age = Column(Integer, default=100)
    is_ai_generated = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    rating = Column(Integer, nullable=True)  # 1-5

    # Foreign keys
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)

    # Relationships
    family = relationship("Family", back_populates="activities")
