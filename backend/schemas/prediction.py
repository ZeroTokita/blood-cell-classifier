from pydantic import BaseModel
from datetime import datetime

class PredictionResponse(BaseModel):
    id: str
    cell_type: str
    confidence: float
    created_at: datetime
