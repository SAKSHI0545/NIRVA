from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


BACKEND_DIR = Path(__file__).resolve().parents[2]
ENV_FILE = BACKEND_DIR / ".env"


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    app_name: str = "NIRVA API"
    environment: str = "development"
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "nirva"
    jwt_secret_key: str = "change-this-local-secret"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    frontend_origin: str = "http://localhost:5173"
    spotify_client_id: str = ""
    spotify_client_secret: str = ""
    spotify_market: str = "US"

    model_config = SettingsConfigDict(env_file=ENV_FILE, env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
