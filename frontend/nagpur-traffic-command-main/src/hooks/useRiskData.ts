import { useQuery } from "@tanstack/react-query";

import { getRiskData, getSummary, getTrafficData } from "@/services/api";

const REFRESH_MS = 60_000;

export function useRiskData() {
  return useQuery({
    queryKey: ["raasta", "risk"],
    queryFn: getRiskData,
    refetchInterval: REFRESH_MS,
    staleTime: 30_000,
  });
}

export function useTrafficData() {
  return useQuery({
    queryKey: ["raasta", "traffic"],
    queryFn: getTrafficData,
    refetchInterval: REFRESH_MS,
    staleTime: 30_000,
  });
}

export function useSummary() {
  return useQuery({
    queryKey: ["raasta", "summary"],
    queryFn: getSummary,
    refetchInterval: REFRESH_MS,
    staleTime: 30_000,
  });
}
