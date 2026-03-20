from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Hugging Face
    huggingface_api_token: str
    huggingface_model: str = "microsoft/layoutlmv3-base"

    # Database
    database_url: str

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_cors_origins: str = "http://localhost:3000,http://localhost:3001"

    # File Upload
    max_upload_size: int = 10485760  # 10MB
    allowed_extensions: str = "pdf,png,jpg,jpeg,docx,txt"

    # Task
    task_timeout: int = 300  # 5 minutes

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.api_cors_origins.split(",")]


settings = Settings()
