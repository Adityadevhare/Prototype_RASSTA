import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

import { MOCK_USER_LOCATION, mockRoute } from "@/data/mockData";
import { useRiskData } from "@/hooks/useRiskData";
import type { RiskLocation, RouteEstimate } from "@/lib/raasta/types";

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
  planRoute: (to: string) => void;
  clearRoute: () => void;
  userLocation: typeof MOCK_USER_LOCATION;
}

const RaastaContext = createContext<RaastaContextValue | null>(null);

export function RaastaProvider({ children }: { children: ReactNode }) {
  const query = useRiskData();
  const risk = query.data?.data ?? [];
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [route, setRoute] = useState<RouteEstimate | null>(null);
  const [routeError, setRouteError] = useState<string | null>(null);

  const select = useCallback((name: string | null) => setSelectedName(name), []);

  const focusLocation = useCallback((name: string) => {
    setSelectedName(name);
    setFocusToken((t) => t + 1);
  }, []);

  const planRoute = useCallback(
    (to: string) => {
      const result = mockRoute(to, risk);
      if (!result) {
        setRoute(null);
        setRouteError(`No known destination matching "${to}".`);
        return;
      }
      setRouteError(null);
      setRoute(result);
    },
    [risk],
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
      planRoute,
      clearRoute,
      userLocation: MOCK_USER_LOCATION,
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
      planRoute,
      clearRoute,
    ],
  );

  return <RaastaContext.Provider value={value}>{children}</RaastaContext.Provider>;
}

export function useRaasta() {
  const ctx = useContext(RaastaContext);
  if (!ctx) throw new Error("useRaasta must be used inside RaastaProvider");
  return ctx;
}
