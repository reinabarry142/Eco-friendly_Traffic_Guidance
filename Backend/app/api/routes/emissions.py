from fastapi import APIRouter, Depends
from app.core.emissions import calculate_co2_emissions
from app.api.deps import get_current_user
import json
from pathlib import Path

router = APIRouter()

# Load vehicle data (cache this in production)
VEHICLE_DATA_PATH = Path(__file__).parent.parent.parent / "core" / "data" / "vehicle_models_with_consumption.json"
with open(VEHICLE_DATA_PATH, 'r') as f:
    VEHICLE_DB = json.load(f)


@router.post("/calculate-emissions")
async def calculate_emissions(
        brand: str,
        model: str,
        distance: float,
        current_user: dict = Depends(get_current_user)
):
    """Endpoint that takes brand/model from frontend"""
    vehicle_data = get_vehicle_data(brand, model)
    if not vehicle_data:
        return {"error": "Vehicle not found"}

    emissions = calculate_co2_emissions(distance, vehicle_data)
    return {
        "co2_kg": emissions,
        "vehicle": vehicle_data
    }


def get_vehicle_data(brand: str, model: str) -> dict | None:
    """Helper to find vehicle in database"""
    brand = brand.upper().strip()
    model = model.upper().strip()

    for vehicle in VEHICLE_DB:
        if (vehicle["brand"].upper() == brand and
                vehicle["model"].upper().startswith(model)):
            return vehicle
    return None