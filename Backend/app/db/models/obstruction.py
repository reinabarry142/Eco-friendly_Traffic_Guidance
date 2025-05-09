from pydantic import BaseModel, EmailStr
from typing import Literal
from datetime import datetime



class ObstructionIn(BaseModel):
    obstruction_type: Literal["accident", "embouteillage", "inondation", "manifestations"]
    latitude: float
    longitude: float

class ObstructionOut(ObstructionIn):
    validated: bool
    timestamp: datetime


    class Settings:
        name = "obstructions"
        indexes = ["user_id"]