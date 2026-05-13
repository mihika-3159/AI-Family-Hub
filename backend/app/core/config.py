"""AI Family Hub - Core Configuration"""
from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

load_dotenv()


class Settings(BaseSettings):
    APP_NAME: str = "AI Family Hub"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = ""

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.DATABASE_URL:
            if os.getenv("VERCEL"):
                self.DATABASE_URL = "sqlite:////tmp/family_hub.db"
            else:
                self.DATABASE_URL = "sqlite:///./family_hub.db"
        
        # In Vercel, SQLite must be in /tmp
        if os.getenv("VERCEL") and "sqlite" in self.DATABASE_URL and "/tmp/" not in self.DATABASE_URL:
            self.DATABASE_URL = "sqlite:////tmp/family_hub.db"
            
        print(f"Using DATABASE_URL: {self.DATABASE_URL}")

    # JWT Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "change-this-in-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Gemini AI - Free Tier Rate Limits
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_RPM_LIMIT: int = int(os.getenv("GEMINI_RPM_LIMIT", "15"))
    GEMINI_RPD_LIMIT: int = int(os.getenv("GEMINI_RPD_LIMIT", "1500"))

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()
