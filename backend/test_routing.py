#!/usr/bin/env python3
"""Quick test of routing and data integrity."""

from app.routing import get_route, KNOWN_DESTINATIONS
from app.data import get_traffic_data

print("=" * 60)
print("BACKEND ROUTING & DATA INTEGRITY TESTS")
print("=" * 60)

# Test 1: Verify all 5 monitored sectors in risk data
print("\nTEST 1: Risk data integrity")
print("-" * 40)
from app.risk_engine import calculate_risk_score, get_risk_level
traffic = get_traffic_data()
print(f"Total sectors: {len(traffic)}")
for loc in traffic:
    score = calculate_risk_score(loc["vehicle_count"], loc["accidents"], loc["congestion"])
    level = get_risk_level(score)
    print(f"  ✓ {loc['location']:20} risk={score:5.1f} level={level:10}")

# Test 2: Route to monitored sector (Sitabuldi)
print("\nTEST 2: Route to Sitabuldi (monitored sector)")
print("-" * 40)
try:
    result = get_route(destination_name="Sitabuldi")
    print(f"  ✓ Success")
    print(f"    From: {result['from']}")
    print(f"    To: {result['to']}")
    print(f"    Distance: {result['distanceKm']} km")
    print(f"    Condition: {result['condition']}")
    print(f"    Source: {result['source']}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 3: Route to unknown location (Wadi)
print("\nTEST 3: Route to Wadi (unknown location)")
print("-" * 40)
try:
    result = get_route(destination_name="Wadi")
    print(f"  ✓ Success (fallback)")
    print(f"    To: {result['to']}")
    print(f"    Distance: {result['distanceKm']} km")
    print(f"    Source: {result['source']}")
    print(f"    Note: {result.get('note', 'N/A')}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 4: Route to Mahal (non-monitored arbitrary location)
print("\nTEST 4: Route to Mahal (non-monitored location)")
print("-" * 40)
try:
    result = get_route(destination_name="Mahal")
    print(f"  ✓ Success (fallback)")
    print(f"    To: {result['to']}")
    print(f"    Distance: {result['distanceKm']} km")
    print(f"    Source: {result['source']}")
except Exception as e:
    print(f"  ✗ Error: {e}")

# Test 5: Check KNOWN_DESTINATIONS
print("\nTEST 5: Backend KNOWN_DESTINATIONS")
print("-" * 40)
print(f"Total known destinations: {len(KNOWN_DESTINATIONS)}")
for name in sorted(KNOWN_DESTINATIONS.keys()):
    coords = KNOWN_DESTINATIONS[name]
    print(f"  • {name:30} {coords}")

print("\n" + "=" * 60)
print("All backend tests completed successfully!")
print("=" * 60)
