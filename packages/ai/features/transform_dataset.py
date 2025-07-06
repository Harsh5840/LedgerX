import json
import pandas as pd
from pathlib import Path
from datetime import datetime

# 🔄 Fixed category list (must match ml.ts and features.py exactly)
CATEGORY_LABELS = [
    "food", "transport", "housing", "entertainment", "shopping",
    "health", "utilities", "travel", "education", "investment", "others"
]
CATEGORY_TO_IDX = {cat: i for i, cat in enumerate(CATEGORY_LABELS)}

def load_dataset(path: str) -> pd.DataFrame:
    with open(path, "r") as f:
        data = json.load(f)
    return pd.DataFrame(data)

def encode_timestamp(ts: str) -> float:
    dt = datetime.fromisoformat(ts)
    return dt.hour + dt.minute / 60.0  # Convert time into float hours

def encode_category(category: str) -> int:
    category = category.lower()
    return CATEGORY_TO_IDX.get(category, CATEGORY_TO_IDX["others"])

def transform_dataset(df: pd.DataFrame) -> pd.DataFrame:
    df["hour"] = df["timestamp"].apply(encode_timestamp)
    df["isReversal"] = df["isReversal"].fillna(False).astype(int) if "isReversal" in df else pd.Series([0]*len(df), index=df.index)

    # Encode category using fixed mapping
    df["category_encoded"] = df["category"].apply(encode_category)

    # Encode type: debit = 1, credit = 0
    df["type_encoded"] = df["type"].map({"debit": 1, "credit": 0}).fillna(0).astype(int)

    features = df[["amount", "hour", "category_encoded", "type_encoded", "isReversal"]].copy()
    return features

if __name__ == "__main__":
    dataset_path = Path(__file__).resolve().parent.parent / "data" / "synthetic_ledger.json"
    df = load_dataset(str(dataset_path))
    features = transform_dataset(df)

    output_path = dataset_path.parent / "features.csv"
    features.to_csv(output_path, index=False)
    print(f"✅ Features saved to: {output_path}")
