import {
  MOCK_RISK_DATA,
  MOCK_SUMMARY,
  MOCK_TRAFFIC_DATA,
  mockRoute,
  summaryFromRisk,
} from "@/data/mockData";
import type { Fetched, RiskLocation, RouteEstimate, Summary, TrafficRecord } from "@/lib/raasta/types";

/**
 * RAASTA API service layer. All backend access goes through this module —
 * components never call fetch directly.
 */

export const API_BASE_URL =
  (import.meta.env["VITE_RAASTA_API_URL"] as string | undefined) ?? "http://127.0.0.1:8000";

async function request<T>(path: string, timeoutMs = 7000, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

function unwrap<T>(payload: unknown, keys: string[]): T {
  if (Array.isArray(payload)) return payload as T;
  if (payload && typeof payload === "object") {
    const obj = payload as Record<string, unknown>;
    for (const key of keys) {
      if (Array.isArray(obj[key])) return obj[key] as T;
    }
  }
  return payload as T;
}

/** GET /api/risk — falls back to the local sample dataset when offline. */
export async function getRiskData(): Promise<Fetched<RiskLocation[]>> {
  try {
    const raw = await request<unknown>("/api/risk");
    const data = unwrap<RiskLocation[]>(raw, ["risk", "data", "results", "locations"]);
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty response");
    return { data, source: "live" };
  } catch (err) {
    return {
      data: MOCK_RISK_DATA,
      source: "mock",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** GET /api/traffic */
export async function getTrafficData(): Promise<Fetched<TrafficRecord[]>> {
  try {
    const raw = await request<unknown>("/api/traffic");
    const data = unwrap<TrafficRecord[]>(raw, ["traffic", "data", "results"]);
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty response");
    return { data, source: "live" };
  } catch (err) {
    return {
      data: MOCK_TRAFFIC_DATA,
      source: "mock",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** GET /api/summary */
export async function getSummary(): Promise<Fetched<Summary>> {
  try {
    const data = await request<Summary>("/api/summary");
    if (!data || typeof data.total_locations !== "number") throw new Error("Malformed response");
    return { data, source: "live" };
  } catch (err) {
    return {
      data: MOCK_SUMMARY,
      source: "mock",
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/** POST /api/route — calls OpenRouteService via backend with fallback to local corridor */
export async function getRoute(params: {
  origin?: [number, number];
  destination?: [number, number];
  originName?: string;
  destinationName: string;
  risk?: RiskLocation[];
}): Promise<Fetched<RouteEstimate>> {
  try {
    const data = await request<RouteEstimate>("/api/route", 7000, {
      method: "POST",
      body: JSON.stringify({
        origin: params.origin,
        destination: params.destination,
        origin_name: params.originName || "Current Location",
        destination_name: params.destinationName,
      }),
    });

    if (!data || !Array.isArray(data.path) || data.path.length === 0) {
      throw new Error("Invalid route geometry returned");
    }

    return {
      data,
      source: data.source === "live" ? "live" : "mock",
    };
  } catch (err) {
    // Local fallback when backend is offline
    const fallbackData = mockRoute(params.destinationName, params.risk || MOCK_RISK_DATA);
    if (!fallbackData) {
      throw new Error(`Unable to calculate route to "${params.destinationName}"`);
    }
    return {
      data: {
        ...fallbackData,
        source: "mock",
      },
      source: "mock",
      error: err instanceof Error ? err.message : "Backend routing offline",
    };
  }
}

/** Derive a summary locally when only risk rows are available. */
export const deriveSummary = summaryFromRisk;

