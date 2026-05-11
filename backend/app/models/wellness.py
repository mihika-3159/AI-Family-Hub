"""AI Family Hub - Wellness Entry Model"""
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin


class WellnessEntry(Base, TimestampMixin):
    __tablename__ = "wellness_entries"

    id = Column(Integer, primary_key=True, index=True)
    mood_score = Column(Integer, nullable=True)  # 1-5 scale
    mood_emoji = Column(String(10), nullable=True)
    energy_level = Column(Integer, nullable=True)  # 1-5
    sleep_hours = Column(Float, nullable=True)
    water_glasses = Column(Integer, nullable=True)
    exercise_minutes = Column(Integer, nullable=True)
    stress_level = Column(Integer, nullable=True)  # 1-5
    notes = Column(Text, nullable=True)
    medication_taken = Column(String(500), nullable=True)  # comma-separated meds
    ai_insight = Column(Text, nullable=True)
    date = Column(DateTime, nullable=False)

    # Foreign keys
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    user = relationship("User", back_populates="wellness_entries")
