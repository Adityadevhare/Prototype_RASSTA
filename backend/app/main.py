from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.data import get_traffic_data
from app.risk_engine import (
    calculate_risk_score,
    get_risk_level,
    get_deployment_recommendation
)

app = FastAPI(
    title="RAASTA API",
    description="AI-Based Traffic Risk Analysis and Police Deployment Decision Support System",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://192.168.1.2:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROOT ENDPOINT
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "RAASTA backend is running",
        "status": "success"
    }


# --------------------------------------------------
# TRAFFIC DATA ENDPOINT
# --------------------------------------------------

@app.get("/api/traffic")
def traffic_data():
    return get_traffic_data()


# --------------------------------------------------
# RISK ANALYSIS ENDPOINT
# --------------------------------------------------

@app.get("/api/risk")
def risk_analysis():
    traffic_records = get_traffic_data()
    results = []

    for location in traffic_records:
        score = calculate_risk_score(
            location["vehicle_count"],
            location["accidents"],
            location["congestion"]
        )
        risk_level = get_risk_level(score)
        deployment = get_deployment_recommendation(score)

        results.append({
            "location": location["location"],
            "latitude": location["latitude"],
            "longitude": location["longitude"],
            "vehicle_count": location["vehicle_count"],
            "accidents": location["accidents"],
            "congestion": location["congestion"],
            "time": location["time"],
            "risk_score": score,
            "risk_level": risk_level,
            "priority": deployment["priority"],
            "police_units": deployment["police_units"],
            "recommendation": deployment["recommendation"]
        })

    return results


# --------------------------------------------------
# SUMMARY ENDPOINT
# --------------------------------------------------

@app.get("/api/summary")
def summary():
    traffic_records = get_traffic_data()
    total_locations = len(traffic_records)

    critical_risk_locations = 0
    high_risk_locations = 0
    moderate_risk_locations = 0
    normal_risk_locations = 0

    total_risk_score = 0
    total_police_units = 0

    highest_risk_location = None
    highest_risk_score = -1

    for location in traffic_records:
        risk_score = calculate_risk_score(
            location["vehicle_count"],
            location["accidents"],
            location["congestion"]
        )
        risk_level = get_risk_level(risk_score)
        deployment = get_deployment_recommendation(risk_score)

        if risk_level == "CRITICAL":
            critical_risk_locations += 1
        elif risk_level == "HIGH":
            high_risk_locations += 1
        elif risk_level == "MODERATE":
            moderate_risk_locations += 1
        else:
            normal_risk_locations += 1

        total_risk_score += risk_score
        total_police_units += deployment["police_units"]

        if risk_score > highest_risk_score:
            highest_risk_score = risk_score
            highest_risk_location = location["location"]

    average_risk_score = (
        round(total_risk_score / total_locations, 2)
        if total_locations > 0
        else 0
    )

    return {
        "total_locations": total_locations,
        "critical_risk_locations": critical_risk_locations,
        "high_risk_locations": high_risk_locations,
        "moderate_risk_locations": moderate_risk_locations,
        "normal_risk_locations": normal_risk_locations,
        "average_risk_score": average_risk_score,
        "highest_risk_location": highest_risk_location,
        "highest_risk_score": highest_risk_score,
        "total_police_units": total_police_units
    }


'''
cd D:\RAASTA\backend
.\venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

cd D:\RAASTA\frontend\nagpur-traffic-command-main
npm run dev
'''