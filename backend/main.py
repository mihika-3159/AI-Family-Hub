from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import get_settings
from app.api import auth, family, tasks, wellness, memories, activities, ai, notifications, export, medications
from app.db.session import init_db

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
)

# Initialize Database (moved to lazy init in session.py)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(family.router, prefix="/api/family", tags=["family"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["tasks"])
app.include_router(wellness.router, prefix="/api/wellness", tags=["wellness"])
app.include_router(memories.router, prefix="/api/memories", tags=["memories"])
app.include_router(activities.router, prefix="/api/activities", tags=["activities"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(notifications.router, prefix="/api/notifications", tags=["notifications"])
app.include_router(export.router, prefix="/api/export", tags=["export"])
app.include_router(medications.router, prefix="/api/medications", tags=["medications"])

from fastapi import Request
from fastapi.responses import JSONResponse
import traceback

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"Global exception caught: {str(exc)}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": f"Internal Server Error: {str(exc)}", "traceback": traceback.format_exc()},
    )

@app.get("/")
def root():
    return {"message": "Welcome to AI Family Hub API", "version": settings.APP_VERSION}
