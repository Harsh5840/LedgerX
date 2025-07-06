import numpy as np
from datetime import datetime

CATEGORIES = [
    "food", "transport", "housing", "entertainment", "shopping",
    "health", "utilities", "travel", "education", "investment", "others"
]

CATEGORY_TO_IDX = {cat: i for i, cat in enumerate(CATEGORIES)}

def transform_entry(entry: dict) -> np.ndarray:
    """
    Convert a ledger entry dict into a numerical feature vector for the model.

    Features:
    - amount (float)
    - hour of day (int)
    - category (one-hot)
    """
    amount = float(entry.get("amount", 0))

    # Extract hour from timestamp
    timestamp_str = entry.get("timestamp")
    if timestamp_str:
        hour = datetime.fromisoformat(timestamp_str).hour
    else:
        hour = 0  # Default fallback

    # One-hot encode category
    category = entry.get("category", "others")
    category_vector = np.zeros(len(CATEGORIES))
    category_idx = CATEGORY_TO_IDX.get(category, CATEGORY_TO_IDX["others"])
    category_vector[category_idx] = 1

    features = np.array([amount, hour])
    return np.concatenate([features, category_vector])
