import numpy as np
from joblib import load
from pathlib import Path

from features import transform_entry

# Load model path
MODEL_PATH = Path(__file__).parent.parent.parent / "saved_models" / "isolation_forest.pkl"

# Load once and reuse
model = load(MODEL_PATH)

def predict(entry: dict) -> dict:
    """
    Predict anomaly score and label for a given ledger entry.

    Returns:
        {
            "score": float,
            "is_anomaly": bool
        }
    """
    features = transform_entry(entry).reshape(1, -1)

    # Anomaly score: the lower, the more anomalous
    score = model.decision_function(features)[0]
    is_anomaly = model.predict(features)[0] == -1

    return {
        "score": float(score),
        "is_anomaly": bool(is_anomaly)
    }
