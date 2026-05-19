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

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
