import certifi
import motor.motor_asyncio
from os import getenv
from dotenv import load_dotenv
from beanie import init_beanie
from app.db.models.user import User
from app.db.models.profile import Profile
from app.db.models.history import History

load_dotenv()

MONGO_URL = getenv("MONGODB_URL")
DB_NAME = getenv("DB_NAME")

client = motor.motor_asyncio.AsyncIOMotorClient(
    MONGO_URL,
    tlsCAFile=certifi.where()
)

async def init_db():
    await init_beanie(
        database=client[DB_NAME],
        document_models=[User, Profile, History]
    )
