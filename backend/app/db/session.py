"""AI Family Hub - Database Session Management"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import get_settings
import os

settings = get_settings()

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {},
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


_db_initialized = False

def get_db():
    """Dependency that provides a database session."""
    global _db_initialized
    if not _db_initialized:
        try:
            # For SQLite in /tmp, ensure the directory exists (though it usually does)
            if "sqlite" in settings.DATABASE_URL:
                db_path = settings.DATABASE_URL.replace("sqlite:///", "")
                if db_path.startswith("/"): # Absolute path
                    db_dir = os.path.dirname(db_path)
                    if db_dir and not os.path.exists(db_dir):
                        os.makedirs(db_dir, exist_ok=True)
            
            print(f"Initializing database at {settings.DATABASE_URL}...")
            init_db()
            _db_initialized = True
            print("Database initialized successfully.")
        except Exception as e:
            print(f"Database initialization error: {str(e)}")
            import traceback
            traceback.print_exc()
            from fastapi import HTTPException
            raise HTTPException(status_code=500, detail=f"Database initialization failed: {str(e)}")
        
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    from app.db.base import Base
    from app.models import user, family, task, memory, wellness, activity, medication, notification  # noqa: F401
    Base.metadata.create_all(bind=engine)
