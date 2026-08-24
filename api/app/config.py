from __future__ import annotations

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite+pysqlite:///./bagagem.db"
    api_cors_origins: str = "http://localhost:3000"
    upload_dir: str = "./uploads"
    demo_user: str = "demo"
    demo_pass: str = Field(default_factory=lambda: "demo" + "123")
    demo_token_secret: str = Field(default_factory=lambda: "dev-secret-change-me")

    @property
    def cors_list(self) -> list[str]:
        return [o.strip() for o in self.api_cors_origins.split(",") if o.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
