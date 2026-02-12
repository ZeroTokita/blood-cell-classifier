import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("MONGODB_DB", "blood_cell_classifier")

if not MONGODB_URI:
    raise RuntimeError("MONGODB_URI no está definido. Revisa tu archivo .env")

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Colecciones
users_col = db["users"]
predictions_col = db["predictions"]
