from beanie import Document
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    profile_picture: Optional[str] = None

class User(Document, UserBase):
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    points: int = 0
    is_active: bool = True

    class UserCreate(BaseModel):
        email: EmailStr
        name: str
        password: str

    class Settings:
        name = "users"
        indexes = ["email"]
