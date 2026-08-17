export type RiskLevel = "CRITICAL" | "HIGH" | "MODERATE" | "NORMAL";
export type Priority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export interface RiskLocation {
  location: string;
  latitude: number;
  longitude: number;
  vehicle_count: number;
  accidents: number;
  congestion: number;
  time: string;
  risk_score: number;
  risk_level: RiskLevel;
  priority: Priority;
  police_units: number;
  recommendation: string;
}

export interface TrafficRecord {
  location: string;
  latitude: number;
  longitude: number;
  vehicle_count: number;
  average_speed: number;
  congestion: number;
  time: string;
}

export interface Summary {
  total_locations: number;
  critical_risk_locations: number;
  high_risk_locations: number;
  moderate_risk_locations: number;
  normal_risk_locations: number;
  average_risk_score: number;
  highest_risk_location: string;
  highest_risk_score: number;
  total_police_units: number;
}

/** Where the data currently on screen came from. Never claim live if mocked. */
export type DataSource = "live" | "mock";

export interface Fetched<T> {
  data: T;
  source: DataSource;
  error?: string;
}

export interface RouteEstimate {
  from: string;
  to: string;
  distanceKm: number;
  durationMin: number;
  condition: RiskLevel;
  path: [number, number][];
  note: string;
}
