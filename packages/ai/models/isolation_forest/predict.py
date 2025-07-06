# packages/ai/models/isolation_forest/predict.py

import os
import joblib
import numpy as np
from pathlib import Path
from .features import transform_entry

# Define consistent model path (centralized & relative-safe)
MODEL_PATH = Path(__file__).resolve().parent.parent.parent / "saved_models" / "isolation_forest.pkl"

# Load once
if not MODEL_PATH.exists():
    raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
model = joblib.load(MODEL_PATH)

def predict(entry: dict) -> dict:
    """
    Predict anomaly score and label for a given ledger entry.

    Args:
        entry (dict): A single ledger entry.

    Returns:
        dict: {
            "isAnomaly": bool,
            "score": float
        }
    """
    features = transform_entry(entry).reshape(1, -1)
    score = model.decision_function(features)[0]
    is_anomaly = model.predict(features)[0] == -1

    return {
        "isAnomaly": is_anomaly,
        "score": float(score)
    }
