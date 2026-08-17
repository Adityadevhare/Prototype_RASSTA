import { createFileRoute } from "@tanstack/react-router";
import { Compass, Layers, Shield } from "lucide-react";

import { MapCanvas } from "@/components/map/MapCanvas";
import { LocationDetailPanel } from "@/components/traffic/LocationDetailPanel";
import { RoutePanel } from "@/components/traffic/RoutePanel";
import { TrafficAreaList } from "@/components/traffic/TrafficAreaList";
import { useRaasta } from "@/lib/raasta/store";

export const Route = createFileRoute("/app/map")({
  head: () => ({
    meta: [
      { title: "Geospatial Command Map — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Geospatial sector risk visualization, tactical police deployment and strategic corridor planning for Nagpur City.",
      },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  const { risk, route } = useRaasta();
  const criticalCount = risk.filter((r) => r.risk_level === "CRITICAL").length;

  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2.5 overflow-y-auto scroll-thin p-2.5 lg:grid-cols-[330px_minmax(0,1fr)] xl:grid-cols-[350px_minmax(0,1fr)] lg:overflow-hidden bg-background">
      {/* Tactical Left Control & Telemetry Strip */}
      <div className="flex min-h-0 flex-col gap-2.5 lg:overflow-y-auto lg:scroll-thin">
        <RoutePanel />
        <LocationDetailPanel />
        <TrafficAreaList className="min-h-52 lg:flex-1" />
      </div>

      {/* Main Tactical Map Frame */}
      <div className="min-h-[440px] lg:min-h-0 flex flex-col gap-2">
        <div className="flex-1 min-h-0">
          <MapCanvas className="h-full" />
        </div>
      </div>
    </div>
  );
}
