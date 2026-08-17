import os
import json
import math
import urllib.request
import urllib.error
from pathlib import Path

from app.data import get_traffic_data
from app.risk_engine import calculate_risk_score, get_risk_level

# --------------------------------------------------
# ENVIRONMENT CONFIGURATION
# --------------------------------------------------

def load_env():
    """
    Safely load key-value pairs from backend/.env into os.environ
    without introducing third-party dependencies.
    """
    env_path = Path(__file__).resolve().parent.parent / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip("'\"")
                        if k:
                            os.environ[k] = v
        except Exception:
            pass

load_env()

# Known Nagpur Destination Coordinates
KNOWN_DESTINATIONS = {
    "Nagpur Airport": [21.0922, 79.0472],
    "Sitabuldi": [21.1465, 79.0785],
    "Sadar": [21.1652, 79.0812],
    "Manish Nagar": [21.0861, 79.0592],
    "Hingna Road": [21.1147, 78.9812],
    "Nagpur Railway Station": [21.1522, 79.0866],
}

DEFAULT_ORIGIN = [21.1398, 79.0805]  # Ramdaspeth HQ

# Handcrafted realistic fallback corridors
FALLBACK_CORRIDORS = {
    "Nagpur Airport": [
        [21.1398, 79.0805], [21.1325, 79.0760], [21.1248, 79.0680],
        [21.1165, 79.0585], [21.1095, 79.0520], [21.1020, 79.0480],
        [21.0955, 79.0475], [21.0922, 79.0472]
    ],
    "Sitabuldi": [
        [21.1398, 79.0805], [21.1415, 79.0780], [21.1438, 79.0765],
        [21.1452, 79.0772], [21.1465, 79.0785]
    ],
    "Sadar": [
        [21.1398, 79.0805], [21.1460, 79.0790], [21.1510, 79.0800],
        [21.1575, 79.0808], [21.1652, 79.0812]
    ],
    "Manish Nagar": [
        [21.1398, 79.0805], [21.1310, 79.0740], [21.1215, 79.0650],
        [21.1110, 79.0620], [21.0980, 79.0605], [21.0861, 79.0592]
    ],
    "Hingna Road": [
        [21.1398, 79.0805], [21.1370, 79.0650], [21.1340, 79.0450],
        [21.1280, 79.0200], [21.1210, 79.0020], [21.1147, 78.9812]
    ],
    "Nagpur Railway Station": [
        [21.1398, 79.0805], [21.1445, 79.0810], [21.1480, 79.0835],
        [21.1505, 79.0855], [21.1522, 79.0866]
    ],
}


def haversine_km(lat1, lon1, lat2, lon2):
    """Calculate great circle distance between two points in km."""
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c


def evaluate_route_risk(path_coords):
    """
    Assess traffic risk severity along the given route path based on
    proximity to monitored sector risk hotspots.
    """
    traffic_records = get_traffic_data()
    intercepted_sectors = []
    max_risk_score = 0.0

    for sector in traffic_records:
        sec_lat = sector["latitude"]
        sec_lon = sector["longitude"]
        score = calculate_risk_score(
            sector["vehicle_count"],
            sector["accidents"],
            sector["congestion"]
        )

        # Find min distance from this sector hotspot to any waypoint on the route
        min_dist = float("inf")
        # Subsample path if very long to keep evaluation fast
        sample_step = max(1, len(path_coords) // 40)
        for pt in path_coords[::sample_step]:
            d = haversine_km(sec_lat, sec_lon, pt[0], pt[1])
            if d < min_dist:
                min_dist = d

        # If route passes within 2.0 km of this sector hotspot
        if min_dist <= 2.0:
            intercepted_sectors.append({
                "location": sector["location"],
                "risk_score": score,
                "risk_level": get_risk_level(score),
                "distance_km": round(min_dist, 2)
            })
            if score > max_risk_score:
                max_risk_score = score

    if max_risk_score == 0.0:
        # If no sector is close, check nearest sector overall
        nearest_score = 30.0
        nearest_name = "Nagpur Central"
        best_d = float("inf")
        for s in traffic_records:
            d = haversine_km(s["latitude"], s["longitude"], path_coords[-1][0], path_coords[-1][1])
            if d < best_d:
                best_d = d
                score = calculate_risk_score(s["vehicle_count"], s["accidents"], s["congestion"])
                nearest_score = score
                nearest_name = s["location"]
        condition = get_risk_level(nearest_score)
        return condition, round(nearest_score, 1), intercepted_sectors

    condition = get_risk_level(max_risk_score)
    return condition, round(max_risk_score, 1), intercepted_sectors


def plan_route_ors(origin_coords, dest_coords, origin_name, dest_name):
    """
    Execute road routing via OpenRouteService Directions API.
    Returns route data if successful, or raises an Exception.
    """
    load_env()
    api_key = os.environ.get("OPENROUTESERVICE_API_KEY", "").strip()
    if not api_key:
        raise ValueError("OPENROUTESERVICE_API_KEY is not configured in backend/.env")

    # ORS expects coordinates as [longitude, latitude]
    url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
    payload = {
        "coordinates": [
            [origin_coords[1], origin_coords[0]],
            [dest_coords[1], dest_coords[0]]
        ]
    }

    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": api_key,
            "Content-Type": "application/json",
            "Accept": "application/json, application/geo+json",
            "User-Agent": "RAASTA-CommandCenter/1.0"
        }
    )

    with urllib.request.urlopen(req, timeout=7) as response:
        if response.status != 200:
            raise RuntimeError(f"OpenRouteService returned status code {response.status}")
        data = json.loads(response.read().decode("utf-8"))

    feature = data["features"][0]
    geometry = feature["geometry"]["coordinates"]
    summary = feature["properties"]["summary"]

    # Convert [lon, lat] from GeoJSON to [lat, lon] for Leaflet
    leaflet_path = [[coord[1], coord[0]] for coord in geometry]
    distance_km = round(summary.get("distance", 0.0) / 1000.0, 1)
    duration_min = max(1, round(summary.get("duration", 0.0) / 60.0))

    condition, risk_score, intercepted = evaluate_route_risk(leaflet_path)

    note = f"Live road routing via OpenRouteService Directions API ({len(leaflet_path)} waypoints)."
    if intercepted:
        sectors_str = ", ".join(s["location"] for s in intercepted[:2])
        note += f" Traversing near {sectors_str} sectors."

    return {
        "from": origin_name,
        "to": dest_name,
        "distanceKm": distance_km,
        "durationMin": duration_min,
        "condition": condition,
        "path": leaflet_path,
        "note": note,
        "source": "live",
        "status": "success",
        "risk_score": risk_score,
        "intercepted_sectors": intercepted
    }


def plan_route_fallback(origin_coords, dest_coords, origin_name, dest_name, reason=""):
    """
    Fallback corridor generator when OpenRouteService is offline or unconfigured.
    """
    # Check if we have a predefined corridor for this destination
    if dest_name in FALLBACK_CORRIDORS:
        path = FALLBACK_CORRIDORS[dest_name]
    else:
        path = [
            origin_coords,
            [origin_coords[0] + (dest_coords[0] - origin_coords[0]) * 0.35 + 0.003,
             origin_coords[1] + (dest_coords[1] - origin_coords[1]) * 0.35 - 0.002],
            [origin_coords[0] + (dest_coords[0] - origin_coords[0]) * 0.7 - 0.002,
             origin_coords[1] + (dest_coords[1] - origin_coords[1]) * 0.7 + 0.003],
            dest_coords
        ]

    km = round(haversine_km(origin_coords[0], origin_coords[1], dest_coords[0], dest_coords[1]) * 1.35, 1)
    condition, risk_score, intercepted = evaluate_route_risk(path)
    speed = 14 if condition == "CRITICAL" else 18 if condition == "HIGH" else 26 if condition == "MODERATE" else 34
    duration_min = max(4, round((km / speed) * 60))

    note = "Sample corridor estimate"
    if reason:
        note += f" ({reason})"
    else:
        note += " (OpenRouteService key not configured or unreachable)."

    return {
        "from": origin_name,
        "to": dest_name,
        "distanceKm": km,
        "durationMin": duration_min,
        "condition": condition,
        "path": path,
        "note": note,
        "source": "fallback",
        "status": "fallback",
        "risk_score": risk_score,
        "intercepted_sectors": intercepted
    }


def get_route(origin=None, destination=None, origin_name="Current Location", destination_name="Nagpur Airport"):
    """
    Main entrypoint for route planning: tries OpenRouteService first, falls back gracefully.
    """
    # Resolve origin coords
    if origin and len(origin) == 2:
        origin_coords = [float(origin[0]), float(origin[1])]
    else:
        origin_coords = DEFAULT_ORIGIN

    # Resolve destination coords
    if destination and len(destination) == 2:
        dest_coords = [float(destination[0]), float(destination[1])]
    elif destination_name in KNOWN_DESTINATIONS:
        dest_coords = KNOWN_DESTINATIONS[destination_name]
    else:
        # Fallback to Airport if completely unknown
        dest_coords = KNOWN_DESTINATIONS["Nagpur Airport"]
        if not destination_name:
            destination_name = "Nagpur Airport"

    try:
        return plan_route_ors(origin_coords, dest_coords, origin_name, destination_name)
    except Exception as err:
        err_msg = str(err)
        # Never leak key in message
        if "OPENROUTESERVICE_API_KEY" in err_msg:
            reason = "API key not configured"
        else:
            reason = "ORS connection offline"
        return plan_route_fallback(origin_coords, dest_coords, origin_name, destination_name, reason=reason)
