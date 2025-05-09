from fastapi import APIRouter, UploadFile, File, Form, HTTPException,Query
from datetime import datetime
from ultralytics import YOLO
import os, shutil, uuid
from typing import List

#from app.models.obstruction_model import ObstructionModel  


router = APIRouter()

# Chargement unique du modèle YOLOv8
model = YOLO("app/db/models/best.pt")

TEMP_DIR = "temp"
os.makedirs(TEMP_DIR, exist_ok=True)

@router.post("/obstruction/report")
async def report_obstruction(
    image: UploadFile = File(...),
    lat: float = Form(...),
    lon: float = Form(...),
    obstruction_type: str = Form(...)
):
    try:
        # Sauvegarde temporaire de l'image
        image_id = str(uuid.uuid4())
        image_path = os.path.join(TEMP_DIR, f"{image_id}.jpg")
        with open(image_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        # Prédiction YOLOv8
        results = model.predict(image_path, conf=0.4, imgsz=640)
        predicted_labels = [results[0].names[int(cls)] for cls in results[0].boxes.cls]

        # Suppression du fichier temporaire
        os.remove(image_path)

        # Validation IA
        if obstruction_type.lower() in [p.lower() for p in predicted_labels]:
            obstruction = {
                "obstruction_type": obstruction_type.lower(),
                "latitude": lat,
                "longitude": lon,
                "timestamp": datetime.utcnow(),
                "validated": True
            }
            await obstruction_collection.insert_one(obstruction)

            return {
                "status": "confirmed",
                "message": "Votre signalement a été validé par l'IA.",
                "latitude": lat,
                "longitude": lon,
                "type": obstruction_type.lower()
            }

        else:
            return {
                "status": "rejected",
                "message": "Le modèle n'a pas reconnu cette obstruction. Merci de réessayer avec une autre image."
            }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.get("/obstructions")
async def get_obstructions(validated: bool = Query(False)):
    query = {"validated": validated} if validated else {}
    obstructions = await obstruction_collection.find(query).to_list(length=100)
    for obs in obstructions:
        obs["_id"] = str(obs["_id"])  # convertit l'ObjectId en string
    return obstructions
