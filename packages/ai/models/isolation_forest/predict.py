import os
import joblib
import numpy as np
from features import transform_entry

MODEL_PATH = os.path.join(os.path.dirname(__file__), "isolation_forest_model.pkl")

def load_model():
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model not found at {MODEL_PATH}")
    return joblib.load(MODEL_PATH)

def predict(entry: dict) -> dict:
    """
    Predicts whether a ledger entry is anomalous.

    Args:
        entry: A ledger entry as a dictionary

    Returns:
        Dictionary with:
            - isAnomaly (bool)
            - score (float)
    """
    model = load_model()
    X = np.array([transform_entry(entry)])
    score = model.decision_function(X)[0]
    isAnomaly = model.predict(X)[0] == -1

    return {
        "isAnomaly": isAnomaly,
        "score": float(score)
    }
