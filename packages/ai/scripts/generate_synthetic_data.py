import json
import random
from datetime import datetime, timedelta
from faker import Faker
from pathlib import Path

fake = Faker()

CATEGORIES = ["groceries", "utilities", "entertainment", "travel", "salary", "others"]
TYPES = ["debit", "credit"]

def generate_entry(user_id: str):
    is_credit = random.random() < 0.2  # 20% are credits
    entry_type = "credit" if is_credit else "debit"

    amount = round(random.uniform(50, 5000), 2)
    if is_credit:
        amount = round(random.uniform(5000, 20000), 2)

    return {
        "userId": user_id,
        "amount": amount,
        "timestamp": fake.date_time_between(start_date="-6M", end_date="now").isoformat(),
        "category": random.choice(CATEGORIES),
        "type": entry_type,
        "isReversal": random.random() < 0.05  # 5% reversals
    }

def generate_dataset(num_users: int, entries_per_user: int):
    dataset = []
    for _ in range(num_users):
        user_id = fake.uuid4()
        for _ in range(entries_per_user):
            dataset.append(generate_entry(user_id))
    return dataset

if __name__ == "__main__":
    data = generate_dataset(num_users=50, entries_per_user=200)
    output_path = Path(__file__).resolve().parent.parent / "data" / "synthetic_ledger.json"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    with open(output_path, "w") as f:
        json.dump(data, f, indent=2)

    print(f"✅ Synthetic dataset saved to: {output_path}")
