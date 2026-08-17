import type { RiskLocation, RouteEstimate, Summary, TrafficRecord } from "@/lib/raasta/types";

/**
 * Fallback dataset used only when the RAASTA FastAPI backend is unreachable.
 * Kept fully separate from the API layer so it is never mistaken for live data.
 */

export const NAGPUR_CENTER: [number, number] = [21.1458, 79.0882];

/** Mock "current location" — replace with browser geolocation later. */
export const MOCK_USER_LOCATION = {
  label: "Current Location",
  latitude: 21.1398,
  longitude: 79.0805,
};

export const MOCK_RISK_DATA: RiskLocation[] = [
  {
    location: "Sitabuldi",
    latitude: 21.1465,
    longitude: 79.0785,
    vehicle_count: 850,
    accidents: 4,
    congestion: 8,
    time: "18:00",
    risk_score: 81.5,
    risk_level: "CRITICAL",
    priority: "CRITICAL",
    police_units: 4,
    recommendation: "Deploy maximum police presence and prioritize traffic monitoring.",
  },
  {
    location: "Wardha Road",
    latitude: 21.1042,
    longitude: 79.0455,
    vehicle_count: 720,
    accidents: 3,
    congestion: 7,
    time: "18:00",
    risk_score: 66.6,
    risk_level: "HIGH",
    priority: "HIGH",
    police_units: 2,
    recommendation: "Increase patrolling at junctions and manage signal timing manually.",
  },
  {
    location: "Sadar",
    latitude: 21.1652,
    longitude: 79.0812,
    vehicle_count: 640,
    accidents: 2,
    congestion: 6,
    time: "18:00",
    risk_score: 64.2,
    risk_level: "HIGH",
    priority: "HIGH",
    police_units: 2,
    recommendation: "Maintain visible presence near market entry points during peak hours.",
  },
  {
    location: "Manish Nagar",
    latitude: 21.0861,
    longitude: 79.0592,
    vehicle_count: 580,
    accidents: 2,
    congestion: 5,
    time: "18:00",
    risk_score: 51.4,
    risk_level: "MODERATE",
    priority: "MEDIUM",
    police_units: 2,
    recommendation: "Monitor railway crossing queues and divert heavy vehicles if needed.",
  },
  {
    location: "Hingna Road",
    latitude: 21.1147,
    longitude: 78.9812,
    vehicle_count: 450,
    accidents: 1,
    congestion: 3,
    time: "18:00",
    risk_score: 33.5,
    risk_level: "NORMAL",
    priority: "LOW",
    police_units: 1,
    recommendation: "Routine monitoring is sufficient. No additional deployment required.",
  },
];

export const MOCK_TRAFFIC_DATA: TrafficRecord[] = MOCK_RISK_DATA.map((r) => ({
  location: r.location,
  latitude: r.latitude,
  longitude: r.longitude,
  vehicle_count: r.vehicle_count,
  average_speed: Math.max(8, Math.round(46 - r.congestion * 4)),
  congestion: r.congestion,
  time: r.time,
}));

export function summaryFromRisk(rows: RiskLocation[]): Summary {
  const high = rows.filter((r) => r.risk_level === "CRITICAL").length;
  const medium = rows.filter((r) => r.risk_level === "HIGH" || r.risk_level === "MODERATE").length;
  const low = rows.filter((r) => r.risk_level === "NORMAL").length;
  const avg = rows.length ? rows.reduce((s, r) => s + r.risk_score, 0) / rows.length : 0;
  const top = [...rows].sort((a, b) => b.risk_score - a.risk_score)[0];
  return {
    total_locations: rows.length,
    high_risk_locations: high,
    medium_risk_locations: medium,
    low_risk_locations: low,
    average_risk_score: Math.round(avg * 100) / 100,
    highest_risk_location: top?.location ?? "—",
    highest_risk_score: top?.risk_score ?? 0,
    total_police_units: rows.reduce((s, r) => s + r.police_units, 0),
  };
}

export const MOCK_SUMMARY: Summary = summaryFromRisk(MOCK_RISK_DATA);

export const DESTINATIONS = [
  { label: "Nagpur Airport", latitude: 21.0922, longitude: 79.0472 },
  { label: "Sitabuldi", latitude: 21.1465, longitude: 79.0785 },
  { label: "Sadar", latitude: 21.1652, longitude: 79.0812 },
  { label: "Manish Nagar", latitude: 21.0861, longitude: 79.0592 },
  { label: "Hingna Road", latitude: 21.1147, longitude: 78.9812 },
  { label: "Nagpur Railway Station", latitude: 21.1522, longitude: 79.0866 },
];

/** Mock route generator — swap for a real routing API (OSRM/Mapbox) later. */
export function mockRoute(toLabel: string, risk: RiskLocation[]): RouteEstimate | null {
  const dest = DESTINATIONS.find((d) => d.label.toLowerCase() === toLabel.trim().toLowerCase());
  if (!dest) return null;
  const from: [number, number] = [MOCK_USER_LOCATION.latitude, MOCK_USER_LOCATION.longitude];
  const to: [number, number] = [dest.latitude, dest.longitude];
  
  // Create multiple smooth waypoints between origin and destination
  const mid1: [number, number] = [
    from[0] + (to[0] - from[0]) * 0.3 + 0.005,
    from[1] + (to[1] - from[1]) * 0.3 - 0.003,
  ];
  const mid2: [number, number] = [
    from[0] + (to[0] - from[0]) * 0.6 - 0.004,
    from[1] + (to[1] - from[1]) * 0.6 + 0.004,
  ];

  const km = haversine(from, to) * 1.28;
  const nearest = [...risk].sort((a, b) => dist(a, to) - dist(b, to))[0];
  const condition = nearest?.risk_level ?? "NORMAL";
  const speed = condition === "CRITICAL" ? 14 : condition === "HIGH" ? 19 : condition === "MODERATE" ? 25 : 32;
  
  return {
    from: MOCK_USER_LOCATION.label,
    to: dest.label,
    distanceKm: Math.round(km * 10) / 10,
    durationMin: Math.round((km / speed) * 60),
    condition,
    path: [from, mid1, mid2, to],
    note: `Estimate based on sample data near ${nearest?.location ?? "Nagpur"}.`,
  };
}

function dist(a: { latitude: number; longitude: number }, b: [number, number]) {
  return haversine([a.latitude, a.longitude], b);
}

function haversine(a: [number, number], b: [number, number]) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180;
  const la2 = (b[0] * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}