import { createFileRoute } from "@tanstack/react-router";

import { MapCanvas } from "@/components/map/MapCanvas";
import { LocationDetailPanel } from "@/components/traffic/LocationDetailPanel";
import { RoutePanel } from "@/components/traffic/RoutePanel";
import { TrafficAreaList } from "@/components/traffic/TrafficAreaList";

export const Route = createFileRoute("/app/map")({
  head: () => ({
    meta: [
      { title: "Live Traffic Map — RAASTA Nagpur" },
      {
        name: "description",
        content:
          "Live geospatial view of Nagpur traffic congestion, risk-scored areas, routes and police deployment guidance.",
      },
      { property: "og:title", content: "Live Traffic Map — RAASTA Nagpur" },
      {
        property: "og:description",
        content: "Monitor Nagpur traffic congestion and risk areas on an operational map.",
      },
    ],
  }),
  component: LiveMapPage,
});

function LiveMapPage() {
  return (
    <div className="grid h-full min-h-0 grid-cols-1 gap-2 overflow-y-auto scroll-thin p-2 lg:grid-cols-[300px_minmax(0,1fr)] lg:overflow-hidden">
      <div className="flex min-h-0 flex-col gap-2 lg:overflow-y-auto lg:scroll-thin">
        <RoutePanel />
        <TrafficAreaList className="min-h-56 lg:flex-1" />
        <LocationDetailPanel />
      </div>
      <div className="min-h-[420px] lg:min-h-0">
        <MapCanvas />
      </div>
    </div>
  );
}
