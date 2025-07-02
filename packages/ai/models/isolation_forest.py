# packages/ai/models/isolation_forest.py

import pandas as pd
import numpy as np
import os
import joblib
from sklearn.ensemble import IsolationForest

# Sample feature columns — modify based on your LedgerEntry schema
FEATURE_COLUMNS = ["amount", "hour", "day_of_week", "category_encoded"]

def preprocess(data: pd.DataFrame) -> pd.DataFrame:
    """
    Preprocess input data: extract useful features from timestamp, encode category.
    """
    data["timestamp"] = pd.to_datetime(data["timestamp"])
    data["hour"] = data["timestamp"].dt.hour
    data["day_of_week"] = data["timestamp"].dt.dayofweek
    data["category_encoded"] = data["category"].astype("category").cat.codes

    return data[FEATURE_COLUMNS]


def train_and_save_model(csv_path: str, model_path: str):
    """
    Train an Isolation Forest model on the provided CSV and save it.
    """
    df = pd.read_csv(csv_path)
    df_clean = preprocess(df)

    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(df_clean)

    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    joblib.dump(model, model_path)
    print(f"✅ Model saved to {model_path}")


if __name__ == "__main__":
    # Example usage
    csv_file = "data/ledger_data.csv"  # You must create this for testing
    model_output = "packages/ai/saved_models/isolation_forest.pkl"
    train_and_save_model(csv_file, model_output)
