from typing import List
from io import BytesIO
from datetime import datetime

from fastapi import FastAPI, File, UploadFile, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

import tensorflow as tf
import numpy as np
from bson import ObjectId

from utils.preprocess import preprocess_image
from core.dependencies import get_current_user
from routes.auth import router as auth_router
from routes.admin import router as admin_router

from database.mongo import predictions_col

from schemas.prediction import PredictionResponse


app = FastAPI(title="Blood Cell Classifier API")

app.mount("/static", StaticFiles(directory="static"), name="static")

model = tf.keras.models.load_model("model/blood_cells_cnn.h5")

CLASS_NAMES = [
    "Eosinophil",
    "Lymphocyte",
    "Monocyte",
    "Neutrophil"
]

app.include_router(auth_router)
app.include_router(admin_router)


@app.get("/")
def home():
    return {"message": "Blood Cell Classifier API is running"}


@app.get("/web")
def web():
    return FileResponse("static/index.html")


@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    current_user: dict = Depends(get_current_user),
):
    image_bytes = BytesIO(await file.read())
    image = preprocess_image(image_bytes)

    predictions = model.predict(image)
    predicted_class = CLASS_NAMES[np.argmax(predictions)]
    confidence = float(np.max(predictions))

    record = {
        "user_id": str(current_user["_id"]),
        "username": current_user["username"],
        "cell_type": predicted_class,
        "confidence": confidence,
        "created_at": datetime.utcnow(),
    }

    result = predictions_col.insert_one(record)

    return {
        "user": current_user["username"],
        "role": current_user["role"],
        "prediction_id": str(result.inserted_id),
        "prediction": predicted_class,
        "confidence": confidence,
        "created_at": record["created_at"],
    }


@app.get("/my-predictions", response_model=List[PredictionResponse])
def my_predictions(current_user: dict = Depends(get_current_user)):
    cursor = predictions_col.find(
        {"user_id": str(current_user["_id"])},
        {"user_id": 0}  # opcional: ocultar user_id
    ).sort("created_at", -1)

    data = []
    for doc in cursor:
        doc["id"] = str(doc["_id"])
        doc.pop("_id", None)
        data.append(doc)

    return data
