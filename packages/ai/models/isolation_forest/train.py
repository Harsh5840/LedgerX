import os
import joblib
import numpy as np
from sklearn.ensemble import IsolationForest
from features import transform_entry

MODEL_PATH = os.path.join(os.path.dirname(__file__), "isolation_forest_model.pkl")

def transform_dataset(entries: list[dict]) -> np.ndarray:
    return np.array([transform_entry(entry) for entry in entries])

def train_model(data: list[dict], contamination: float = 0.05):
    """
    Train Isolation Forest model on transaction data.

    Args:
        data: List of ledger entry dicts
        contamination: Proportion of outliers in the data
    """
    X = transform_dataset(data)
    
    model = IsolationForest(n_estimators=100, contamination=contamination, random_state=42)
    model.fit(X)

    # Save the model
    joblib.dump(model, MODEL_PATH)
    print(f"[✔] Model saved to {MODEL_PATH}")
