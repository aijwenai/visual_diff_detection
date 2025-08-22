from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    API_KEYS: list[str] = ["my-secret-api-key"]

settings = Settings()
