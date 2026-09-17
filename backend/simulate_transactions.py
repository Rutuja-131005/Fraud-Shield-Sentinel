import requests
import time
import random

API_URL = "http://localhost:8000/api/predict"

def generate_normal_transaction():
    return {
        "customer_id": "C1001",
        "amount": round(random.uniform(800, 3200), 2),
        "merchant": random.choice(["Starbucks", "Grocery Supermarket", "Uber Trip", "Amazon Books"]),
        "location": "Pune",
        "device_id": "DEV001",
        "is_new_device": False,
        "hour": random.randint(9, 21),
        "transactions_last_10min": random.randint(1, 2)
    }

def generate_suspicious_transaction():
    return {
        "customer_id": "C1001",
        "amount": round(random.uniform(35000, 120000), 2),
        "merchant": random.choice(["Electronics Superstore", "Crypto Wallet Transfer", "Bullion Vault"]),
        "location": random.choice(["Mumbai", "Dubai", "London", "Singapore"]),
        "device_id": f"DEV-{random.randint(800, 999)}",
        "is_new_device": True,
        "hour": random.choice([2, 3, 4]),
        "transactions_last_10min": random.randint(6, 12)
    }

def run_simulator():
    print("==================================================")
    print("FraudShield AI — Real-time Transaction Simulator")
    print(f"Target Endpoint: {API_URL}")
    print("Generating simulated payment stream...")
    print("==================================================")

    step = 0
    while True:
        step += 1
        # Inject suspicious transaction every 4th step
        if step % 4 == 0:
            payload = generate_suspicious_transaction()
            print(f"\n[STEP {step}] Injecting SUSPICIOUS High-Risk Transaction...")
        else:
            payload = generate_normal_transaction()
            print(f"\n[STEP {step}] Injecting NORMAL Legitimate Transaction...")

        try:
            res = requests.post(API_URL, json=payload, timeout=3)
            if res.status_code == 200:
                data = res.json()
                print(f" -> TX ID: {data['transaction_id']} | Risk Score: {data['risk_score']}/100 | Risk Level: {data['risk_level']} | Decision: {data['decision']}")
            else:
                print(f" -> Failed with HTTP {res.status_code}: {res.text}")
        except Exception as e:
            print(f" -> Could not reach FastAPI backend at {API_URL}. Error: {e}")

        time.sleep(3)

if __name__ == "__main__":
    run_simulator()
