# Constantes
CO2_FACTORS = {
    "gasoline": 2.31,  # kg CO2/L
    "diesel": 2.68,
    "electric": 0.050  # kg CO2/kWh
}


def calculate_co2_emissions(distance: float, vehicle_data: dict) -> float:
    """
    Calcule les émissions CO2 en kg pour un trajet donné
    :param distance: distance en km
    :param vehicle_data: dictionnaire des données véhicule
    :return: émissions CO2 en kg
    """
    consumption = vehicle_data.get("consumption_value")
    fuel_type = vehicle_data.get("fuel_type")

    if not consumption or not fuel_type:
        raise ValueError("Données véhicule incomplètes")

    if fuel_type == "electric":
        return distance * (consumption / 100) * CO2_FACTORS["electric"]

    if fuel_type not in CO2_FACTORS:
        raise ValueError(f"Type de carburant non supporté: {fuel_type}")

    fuel_used = distance * (consumption / 100)
    return fuel_used * CO2_FACTORS[fuel_type]