from fastapi import APIRouter, Depends
from collections import Counter

from core.dependencies import get_current_admin
from database.mongo import users_col, predictions_col

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/users")
def list_users(current_admin: dict = Depends(get_current_admin)):
    users = []
    for u in users_col.find({}, {"password_hash": 0}):
        users.append({
            "id": str(u["_id"]),
            "username": u["username"],
            "role": u.get("role", "user"),
        })
    return users


@router.get("/predictions")
def list_predictions(current_admin: dict = Depends(get_current_admin)):
    preds = []
    for p in predictions_col.find({}).sort("created_at", -1):
        preds.append({
            "id": str(p["_id"]),
            "user_id": p.get("user_id"),
            "username": p.get("username"),
            "cell_type": p.get("cell_type"),
            "confidence": p.get("confidence"),
            "created_at": p.get("created_at"),
        })
    return preds


@router.get("/stats")
def stats(current_admin: dict = Depends(get_current_admin)):
    total_users = users_col.count_documents({})
    total_predictions = predictions_col.count_documents({})

    cell_types = []
    for p in predictions_col.find({}, {"cell_type": 1}):
        if "cell_type" in p:
            cell_types.append(p["cell_type"])

    counts = Counter(cell_types)

    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "predictions_by_cell_type": dict(counts),
    }
