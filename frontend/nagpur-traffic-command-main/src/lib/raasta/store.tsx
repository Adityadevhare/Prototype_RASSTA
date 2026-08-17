import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { MOCK_USER_LOCATION, mockRoute } from "@/data/mockData";
import { useRiskData } from "@/hooks/useRiskData";
import type { RiskLocation, RouteEstimate } from "@/lib/raasta/types";
import { getRoute } from "@/services/api";

export interface SearchedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

interface RaastaContextValue {
  risk: RiskLocation[];
  isLoading: boolean;
  isError: boolean;
  source: "live" | "mock";
  sourceError?: string | undefined;
  refetch: () => void;
  selected: RiskLocation | null;
  select: (name: string | null) => void;
  focusToken: number;
  focusLocation: (name: string) => void;
  route: RouteEstimate | null;
  routeError: string | null;
  isRouting: boolean;
  planRoute: (to: string) => Promise<void> | void;
  clearRoute: () => void;
  userLocation: typeof MOCK_USER_LOCATION;
  searchedLocation: SearchedLocation | null;
  setSearchedLocation: (location: SearchedLocation | null) => void;
}

const RaastaContext = createContext<RaastaContextValue | null>(null);

export function RaastaProvider({ children }: { children: ReactNode }) {
  const query = useRiskData();
  const risk = query.data?.data ?? [];
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [route, setRoute] = useState<RouteEstimate | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [isRouting, setIsRouting] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState<SearchedLocation | null>(null);

  const select = useCallback((name: string | null) => setSelectedName(name), []);

  const focusLocation = useCallback((name: string) => {
    setSelectedName(name);
    setFocusToken((t) => t + 1);
  }, []);

  const geocodeDestination = useCallback(
    async (locationName: string): Promise<[number, number] | null> => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            locationName + ", Nagpur, Maharashtra, India"
          )}&format=json&limit=1`,
          {
            headers: {
              "User-Agent": "RAASTA-Nagpur-App/1.0",
            },
          }
        );

        if (!response.ok) return null;
        const results = await response.json();
        if (!Array.isArray(results) || results.length === 0) return null;

        const result = results[0];
        return [
          parseFloat(result.lat),
          parseFloat(result.lon),
        ];
      } catch {
        return null;
      }
    },
    []
  );

  const planRoute = useCallback(
    async (to: string) => {
      const target = to.trim();
      if (!target) return;

      setIsRouting(true);
      setRouteError(null);

      try {
        // Try to geocode the destination first to get coordinates
        const destCoords = await geocodeDestination(target);

        const response = await getRoute({
          origin: [MOCK_USER_LOCATION.latitude, MOCK_USER_LOCATION.longitude],
          destination: destCoords || undefined,
          originName: MOCK_USER_LOCATION.label,
          destinationName: target,
          risk,
        });

        if (response.data) {
          setRoute(response.data);
          setRouteError(null);
        } else {
          throw new Error(`Unable to calculate route to "${target}".`);
        }
      } catch (err) {
        // Safe fallback to client-side corridor generator
        const fallback = mockRoute(target, risk);
        if (fallback) {
          setRoute(fallback);
          setRouteError(null);
        } else {
          setRoute(null);
          setRouteError(err instanceof Error ? err.message : `No known destination matching "${target}".`);
        }
      } finally {
        setIsRouting(false);
      }
    },
    [risk, geocodeDestination],
  );

  const clearRoute = useCallback(() => {
    setRoute(null);
    setRouteError(null);
  }, []);

  const value = useMemo<RaastaContextValue>(
    () => ({
      risk,
      isLoading: query.isLoading,
      isError: query.isError,
      source: query.data?.source ?? "mock",
      sourceError: query.data?.error,
      refetch: () => void query.refetch(),
      selected: risk.find((r) => r.location === selectedName) ?? null,
      select,
      focusToken,
      focusLocation,
      route,
      routeError,
      isRouting,
      planRoute,
      clearRoute,
      userLocation: MOCK_USER_LOCATION,
      searchedLocation,
      setSearchedLocation,
    }),
    [
      risk,
      query.isLoading,
      query.isError,
      query.data,
      query.refetch,
      selectedName,
      select,
      focusToken,
      focusLocation,
      route,
      routeError,
      isRouting,
      planRoute,
      clearRoute,
      searchedLocation,
      setSearchedLocation,
    ],
  );

  return <RaastaContext.Provider value={value}>{children}</RaastaContext.Provider>;
}

export function useRaasta() {
  const ctx = useContext(RaastaContext);
  if (!ctx) throw new Error("useRaasta must be used inside RaastaProvider");
  return ctx;
}

