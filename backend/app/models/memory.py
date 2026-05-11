"""AI Family Hub - Memory Model"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from app.db.base_class import Base, TimestampMixin
import enum


class MemoryType(str, enum.Enum):
    PHOTO = "photo"
    VIDEO = "video"
    JOURNAL = "journal"
    VOICE_NOTE = "voice_note"
    MILESTONE = "milestone"


class Memory(Base, TimestampMixin):
    __tablename__ = "memories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    memory_type = Column(SQLEnum(MemoryType), default=MemoryType.PHOTO)
    file_url = Column(String(500), nullable=True)
    ai_caption = Column(Text, nullable=True)
    ai_story = Column(Text, nullable=True)
    emotion_tag = Column(String(50), nullable=True)
    event_date = Column(DateTime, nullable=True)
    tags = Column(String(500), nullable=True)  # comma-separated

    # Foreign keys
    family_id = Column(Integer, ForeignKey("families.id"), nullable=False)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Relationships
    family = relationship("Family", back_populates="memories")
    uploaded_by_user = relationship("User", back_populates="memories")
