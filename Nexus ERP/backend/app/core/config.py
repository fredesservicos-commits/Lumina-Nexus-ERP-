import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "Nexus ERP"
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "sqlite:///./nexus_erp.db",
    )
    CORS_ORIGINS: list[str] = ["*"]
    DEBUG: bool = True
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "nexus-erp-dev-secret-change-in-production")
    FIREBASE_API_KEY: str = os.getenv("FIREBASE_API_KEY", "AIzaSyDy-mIIe3ITRJ6OO--S4T3XFQN2_AKbQd0")
    FIREBASE_PROJECT_ID: str = "lumina-nexus-erp"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
