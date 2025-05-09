from fastapi import APIRouter, Depends, HTTPException
from app.db.models.profile import Profile
from app.db.models.user import User
from app.db.models.history import History
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    profile = await Profile.find_one({"userId": str(current_user["id"])})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return {
        "level": profile.level,
        "avatar": profile.avatar,
        "charging_stations": profile.charging_stations,
        "parking_searches": profile.parking_searches,
        "contributions": profile.contributions,
        "badges": profile.badges,
    }

@router.get("/history")
async def get_history(current_user: User = Depends(get_current_user)):
    history = await History.find_one({"userId": str(current_user["id"])})
    if not history:
        raise HTTPException(status_code=404, detail="History not found")
    return {
        "trips": history.trips if history else []
    }



@router.get("/user")
async def get_user(current_user: User = Depends(get_current_user)):
    return {
        "id": str(current_user["id"]),
        "email": current_user["email"],
        "name": current_user["name"],
    }

@router.put("/profile")
async def update_profile(profile_data: Profile, current_user: User = Depends(get_current_user)):
    profile = await Profile.find_one({"userId": str(current_user["id"])})
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile.update({"$set": profile_data.dict(exclude_unset=True)})
    await profile.save()

    return {"message": "Profile updated successfully"}
