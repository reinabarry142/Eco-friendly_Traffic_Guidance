from fastapi import APIRouter, HTTPException, Depends
from app.db.models.user import User, UserCreate
from app.db.models.profile import Profile
from app.db.models.history import History
from app.core.security import hash_password, verify_password, create_access_token
from datetime import timedelta, datetime
from app.core.config import settings
from app.db.models.loginRequest import LoginRequest


router = APIRouter()

@router.post("/register")
async def register(user_data: UserCreate):
    existing_user = await User.find_one(User.email == user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=hashed_password
    )
    await user.insert()

    profile = Profile(user_id=str(user.id))
    await profile.insert()

    history = History(user_id=str(user.id))
    await history.insert()

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    }

@router.post("/login")
async def login(data: LoginRequest):
    user = await User.find_one(User.email == data.email)
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    user.last_login = datetime.utcnow()
    await user.save()

    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
        }
    }


