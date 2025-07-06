import os
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

def train_model():
    # Load already preprocessed features
    df = pd.read_csv("data/features.csv")

    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(df)

    # os.makedirs("packages/ai/saved_models", exist_ok=True)
    joblib.dump(model, "saved_models/isolation_forest.pkl")

    print("✅ Isolation Forest model trained and saved!")

if __name__ == "__main__":
    train_model()
