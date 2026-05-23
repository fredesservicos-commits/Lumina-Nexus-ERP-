from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.models.database import engine, Base
from app.routers import register_routers

app = FastAPI(
    title=settings.APP_NAME,
    description="ERP brasileiro com rigor contábil estilo SAP",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

db_connected = False


@app.on_event("startup")
def on_startup():
    global db_connected
    try:
        Base.metadata.create_all(bind=engine)
        db_connected = True
    except Exception as e:
        print(f"Database connection failed: {e}")
        db_connected = False


@app.get("/")
def root():
    return {
        "status": "Nexus ERP Online",
        "database": "Connected" if db_connected else "Disconnected",
    }


@app.get("/health")
def health():
    return {"status": "ok"}


register_routers(app)
