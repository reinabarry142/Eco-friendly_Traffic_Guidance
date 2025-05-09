from pydantic import BaseSettings
from dotenv import load_dotenv
import os

load_dotenv()

class Settings(BaseSettings):
    mongodb_url: str = os.getenv("MONGODB_URL")
    db_name: str = os.getenv("DB_NAME")
    secret_key: str = os.getenv("SECRET_KEY")
    algorithm: str = os.getenv("ALGORITHM")
    access_token_expire_minutes: int = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440)

    class Config:
        env_file = "../.env"

settings = Settings()
