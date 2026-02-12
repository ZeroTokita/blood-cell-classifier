from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId

from database.mongo import users_col
from schemas.user import UserCreate
from core.security import hash_password, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post("/register")
def register(user: UserCreate):
    existing = users_col.find_one({"username": user.username})
    if existing:
        raise HTTPException(status_code=400, detail="Usuario ya existe")

    # Primer usuario => admin
    users_count = users_col.count_documents({})
    role = "admin" if users_count == 0 else "user"

    new_user = {
        "username": user.username,
        "password_hash": hash_password(user.password),
        "role": role,
    }

    result = users_col.insert_one(new_user)

    return {
        "message": "Usuario creado correctamente",
        "role": role,
        "user_id": str(result.inserted_id),
    }


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    db_user = users_col.find_one({"username": form_data.username})

    if not db_user or not verify_password(form_data.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    token = create_access_token({
        "user_id": str(db_user["_id"]),
        "role": db_user["role"],
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user["role"],
    }
