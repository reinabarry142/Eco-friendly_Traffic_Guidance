from beanie import Document
from pydantic import BaseModel, Field
from typing import List

class Badge(BaseModel):
    id: int
    name: str
    icon: str
    achieved: bool

class Profile(Document):
    user_id: str = Field(..., alias="userId")
    level: str = Field(default="Éco-Warrior")
    avatar: str = Field(default="default-avatar.jpg")
    charging_stations: int = Field(default=0, alias="chargingStations")
    parking_searches: int = Field(default=0, alias="parkingSearches")
    contributions: int = Field(default=0)
    badges: List[Badge] = Field(default_factory=list)

    class Settings:
        name = "profiles"
        indexes = ["user_id"]
