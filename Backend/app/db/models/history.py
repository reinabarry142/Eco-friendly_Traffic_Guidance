from beanie import Document
from pydantic import BaseModel, Field
from typing import List
from datetime import datetime

class Trip(BaseModel):
    id: int
    date: datetime
    distance: str = Field(alias="distance")
    co2_saved: str = Field(alias="co2Saved")
    transport: str

class History(Document):
    user_id: str = Field(..., alias="userId")
    trips: List[Trip] = Field(default_factory=list)

    class Settings:
        name = "historiques"
        indexes = ["user_id"]
