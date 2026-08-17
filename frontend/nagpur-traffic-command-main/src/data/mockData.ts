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
  const critical = rows.filter((r) => r.risk_level === "CRITICAL").length;
  const high = rows.filter((r) => r.risk_level === "HIGH").length;
  const moderate = rows.filter((r) => r.risk_level === "MODERATE").length;
  const normal = rows.filter((r) => r.risk_level === "NORMAL").length;
  const avg = rows.length ? rows.reduce((s, r) => s + r.risk_score, 0) / rows.length : 0;
  const top = [...rows].sort((a, b) => b.risk_score - a.risk_score)[0];
  return {
    total_locations: rows.length,
    critical_risk_locations: critical,
    high_risk_locations: high,
    moderate_risk_locations: moderate,
    normal_risk_locations: normal,
    average_risk_score: Math.round(avg * 100) / 100,
    highest_risk_location: top?.location ?? "—",
    highest_risk_score: top?.risk_score ?? 0,
    total_police_units: rows.reduce((s, r) => s + r.police_units, 0),
  };
}

export const MOCK_SUMMARY: Summary = summaryFromRisk(MOCK_RISK_DATA);

export const DESTINATIONS = [
  { label: "Nagpur Airport", latitude: 21.0922, longitude: 79.0472, description: "Dr. Babasaheb Ambedkar Intl Airport via Wardha Rd" },
  { label: "Sitabuldi", latitude: 21.1465, longitude: 79.0785, description: "Central Interchange & Metro Junction" },
  { label: "Sadar", latitude: 21.1652, longitude: 79.0812, description: "Residency Rd & Commercial Zone" },
  { label: "Manish Nagar", latitude: 21.0861, longitude: 79.0592, description: "Besa-Manish Nagar Underpass Sector" },
  { label: "Hingna Road", latitude: 21.1147, longitude: 78.9812, description: "MIDC Industrial & Institutional Belt" },
  { label: "Nagpur Railway Station", latitude: 21.1522, longitude: 79.0866, description: "Central Railway Terminal & Kingsway" },
];

/** Handcrafted realistic corridor waypoints starting from Current Location [21.1398, 79.0805] (Dharampeth/Ramdaspeth area) */
const CORRIDOR_PATHS: Record<string, [number, number][]> = {
  "Nagpur Airport": [
    [21.1398, 79.0805], // Current Location (Ramdaspeth)
    [21.1325, 79.0760], // Lokmat Square
    [21.1248, 79.0680], // Rahate Colony Square
    [21.1165, 79.0585], // Chhatrapati Square
    [21.1095, 79.0520], // Ajni / Wardha Road Flyover
    [21.1020, 79.0480], // Ujjwal Nagar
    [21.0955, 79.0475], // Sonegaon approach
    [21.0922, 79.0472], // Nagpur Airport Terminal
  ],
  "Sitabuldi": [
    [21.1398, 79.0805], // Ramdaspeth
    [21.1415, 79.0780], // Shankar Nagar Rd
    [21.1438, 79.0765], // Law College Square
    [21.1452, 79.0772], // Variety Square approach
    [21.1465, 79.0785], // Sitabuldi Main Interchange
  ],
  "Sadar": [
    [21.1398, 79.0805], // Ramdaspeth
    [21.1460, 79.0790], // Sitabuldi Flyover
    [21.1510, 79.0800], // RBI Square
    [21.1575, 79.0808], // Liberty Square / Residency Rd
    [21.1652, 79.0812], // Sadar Market Center
  ],
  "Manish Nagar": [
    [21.1398, 79.0805], // Ramdaspeth
    [21.1310, 79.0740], // Congress Nagar
    [21.1215, 79.0650], // Narendra Nagar Flyover
    [21.1110, 79.0620], // Somalwada Square
    [21.0980, 79.0605], // Manish Nagar T-Point
    [21.0861, 79.0592], // Manish Nagar Central
  ],
  "Hingna Road": [
    [21.1398, 79.0805], // Ramdaspeth
    [21.1370, 79.0650], // Dharampeth / Coffee House
    [21.1340, 79.0450], // Ambazari Lake Drive
    [21.1280, 79.0200], // VNIT / Subhash Nagar
    [21.1210, 79.0020], // Hingna T-Point / YCCE Sector
    [21.1147, 78.9812], // Hingna Road Industrial Belt
  ],
  "Nagpur Railway Station": [
    [21.1398, 79.0805], // Ramdaspeth
    [21.1445, 79.0810], // Anand Talkies
    [21.1480, 79.0835], // Munje Square
    [21.1505, 79.0855], // Kasturchand Park / Kingsway
    [21.1522, 79.0866], // Nagpur Railway Station Main Gate
  ],
};

/** Mock route generator with plausible road corridor geometry */
export function mockRoute(toLabel: string, risk: RiskLocation[]): RouteEstimate | null {
  const dest = DESTINATIONS.find((d) => d.label.toLowerCase() === toLabel.trim().toLowerCase());
  if (!dest) return null;

  const from: [number, number] = [MOCK_USER_LOCATION.latitude, MOCK_USER_LOCATION.longitude];
  const to: [number, number] = [dest.latitude, dest.longitude];

  const path = CORRIDOR_PATHS[dest.label] || [
    from,
    [from[0] + (to[0] - from[0]) * 0.35 + 0.003, from[1] + (to[1] - from[1]) * 0.35 - 0.002],
    [from[0] + (to[0] - from[0]) * 0.7 - 0.002, from[1] + (to[1] - from[1]) * 0.7 + 0.003],
    to,
  ];

  const km = haversine(from, to) * 1.35;
  const nearest = [...risk].sort((a, b) => dist(a, to) - dist(b, to))[0];
  const condition = nearest?.risk_level ?? "NORMAL";
  const speed = condition === "CRITICAL" ? 14 : condition === "HIGH" ? 18 : condition === "MODERATE" ? 26 : 34;

  return {
    from: MOCK_USER_LOCATION.label,
    to: dest.label,
    distanceKm: Math.round(km * 10) / 10,
    durationMin: Math.max(4, Math.round((km / speed) * 60)),
    condition,
    path,
    note: `Strategic corridor via ${nearest?.location ?? "Nagpur Central"} Sector.`,
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