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


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"status": "Nexus ERP Online", "database": "Connected"}


register_routers(app)
