import { useEffect } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";

import { hexFor } from "@/components/common/StatusBadge";
import { NAGPUR_CENTER } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";

function radiusFor(vehicles: number) {
  return 8 + Math.min(12, Math.round(vehicles / 85));
}

function MapEffects() {
  const map = useMap();
  const { selected, focusToken, route, userLocation, searchedLocation } = useRaasta();

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.latitude, selected.longitude], 14, { duration: 0.6 });
  }, [focusToken, selected, map]);

  useEffect(() => {
    if (!searchedLocation) return;
    map.flyTo([searchedLocation.latitude, searchedLocation.longitude], 14, { duration: 0.6 });
  }, [searchedLocation, map]);

  useEffect(() => {
    if (!route || route.path.length === 0) return;
    map.flyToBounds(route.path, { padding: [50, 50], duration: 0.6 });
  }, [route, map]);

  useEffect(() => {
    const onLocate = () => map.flyTo([userLocation.latitude, userLocation.longitude], 14, { duration: 0.5 });
    window.addEventListener("raasta:locate", onLocate);
    return () => window.removeEventListener("raasta:locate", onLocate);
  }, [map, userLocation]);

  useEffect(() => {
    const onZoom = (e: Event) => {
      const detail = (e as CustomEvent<{ delta: number }>).detail;
      map.setZoom(map.getZoom() + detail.delta);
    };
    window.addEventListener("raasta:zoom", onZoom as EventListener);
    return () => window.removeEventListener("raasta:zoom", onZoom as EventListener);
  }, [map]);

  return null;
}

export default function TrafficMapView() {
  const { risk, selected, select, focusLocation, route, userLocation, searchedLocation } = useRaasta();

  return (
    <MapContainer
      center={NAGPUR_CENTER}
      zoom={12}
      minZoom={10}
      maxZoom={18}
      zoomControl={false}
      attributionControl
      className="size-full"
    >
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
        maxZoom={19}
      />

      <MapEffects />

      {/* Searched Location Marker (Geocoded Result) */}
      {searchedLocation ? (
        <CircleMarker
          center={[searchedLocation.latitude, searchedLocation.longitude]}
          radius={12}
          pathOptions={{
            color: "#9333EA",
            weight: 2.5,
            fillColor: "#9333EA",
            fillOpacity: 0.3,
          }}
        >
          <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
            <span className="text-[11px] font-bold text-foreground font-sans">{searchedLocation.name}</span>
          </Tooltip>
        </CircleMarker>
      ) : null}

      {/* Strategic Route Corridor Polyline */}
      {route ? (
        <>
          {/* Route Outer Glow Track */}
          <Polyline
            positions={route.path}
            pathOptions={{
              color: route.condition === "CRITICAL" ? "#EF4444" : "#3B82F6",
              weight: 8,
              opacity: 0.22,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          {/* Route Core Track */}
          <Polyline
            positions={route.path}
            pathOptions={{
              color: route.condition === "CRITICAL" ? "#EF4444" : "#3B82F6",
              weight: 3.5,
              opacity: 0.95,
              lineCap: "round",
              lineJoin: "round",
            }}
          />
          {/* Route Start Point (Origin) */}
          <CircleMarker
            center={route.path[0]}
            radius={7}
            pathOptions={{
              color: "#10B981",
              weight: 2,
              fillColor: "#10B981",
              fillOpacity: 0.9,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
              <span className="text-[10px] font-bold text-normal">START: {route.from}</span>
            </Tooltip>
          </CircleMarker>
          {/* Route Destination Point */}
          <CircleMarker
            center={route.path[route.path.length - 1]}
            radius={8}
            pathOptions={{
              color: "#3B82F6",
              weight: 2.5,
              fillColor: "#1E293B",
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1} permanent>
              <span className="text-[10px] font-bold text-active">DEST: {route.to}</span>
            </Tooltip>
          </CircleMarker>
        </>
      ) : null}

      {/* Sector Risk Markers */}
      {risk.map((r) => {
        const color = hexFor(r.risk_level);
        const isSelected = selected?.location === r.location;
        const isCritical = r.risk_level === "CRITICAL";

        return (
          <div key={r.location}>
            {/* Pulsing Aura Ring for Critical Hotspots */}
            {isCritical ? (
              <CircleMarker
                center={[r.latitude, r.longitude]}
                radius={radiusFor(r.vehicle_count) + 8}
                pathOptions={{
                  color: "#EF4444",
                  weight: 1.2,
                  fillColor: "#EF4444",
                  fillOpacity: 0.12,
                  dashArray: "4, 6",
                }}
              />
            ) : null}

            {/* Selected Focus Halo */}
            {isSelected ? (
              <CircleMarker
                center={[r.latitude, r.longitude]}
                radius={radiusFor(r.vehicle_count) + 5}
                pathOptions={{
                  color: "#3B82F6",
                  weight: 2,
                  fillColor: "#3B82F6",
                  fillOpacity: 0.18,
                }}
              />
            ) : null}

            {/* Primary Sector Marker */}
            <CircleMarker
              center={[r.latitude, r.longitude]}
              radius={radiusFor(r.vehicle_count)}
              pathOptions={{
                color: isSelected ? "#60A5FA" : color,
                weight: isSelected ? 2.5 : 1.5,
                fillColor: color,
                fillOpacity: isSelected ? 0.65 : 0.45,
              }}
              eventHandlers={{ click: () => select(r.location) }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1}>
                <div className="flex items-center gap-1.5 font-sans">
                  <span className="font-bold text-[11px] uppercase tracking-wide">{r.location}</span>
                  <span className="text-[10.5px] opacity-80">· {r.risk_level} ({r.risk_score.toFixed(1)})</span>
                </div>
              </Tooltip>

              <Popup>
                <div className="min-w-48 font-sans p-0.5">
                  <div className="flex items-center justify-between border-b border-border pb-1">
                    <span className="text-[13.5px] font-bold uppercase tracking-wide">{r.location}</span>
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wider rounded-xs"
                      style={{ color, backgroundColor: `${color}20`, border: `1px solid ${color}60` }}
                    >
                      {r.risk_level}
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[11.5px] tabular">
                    <span className="text-muted-foreground">Risk Index:</span>
                    <span className="font-bold text-right" style={{ color }}>
                      {r.risk_score.toFixed(1)} / 100
                    </span>
                    <span className="text-muted-foreground">Traffic Volume:</span>
                    <span className="font-medium text-right text-foreground">{r.vehicle_count} veh/hr</span>
                    <span className="text-muted-foreground">Congestion:</span>
                    <span className="font-medium text-right text-foreground">{r.congestion} / 10</span>
                    <span className="text-muted-foreground">Police Units:</span>
                    <span className="font-bold text-right text-active">{r.police_units} Units ({r.priority})</span>
                  </div>

                  <div className="mt-2 border-t border-border/80 pt-1.5 text-[10.5px] text-muted-foreground italic">
                    {r.recommendation}
                  </div>

                  <button
                    type="button"
                    onClick={() => focusLocation(r.location)}
                    className="mt-2.5 w-full border border-active/60 bg-active-bg/60 py-1 text-center text-[10.5px] font-bold uppercase tracking-wider text-active hover:bg-active-bg transition-colors"
                  >
                    Lock Sector Focus
                  </button>
                </div>
              </Popup>
            </CircleMarker>
          </div>
        );
      })}

      {/* Realtime Patrol Base (User Location) */}
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={14}
        pathOptions={{ color: "#10B981", weight: 1, fillColor: "#10B981", fillOpacity: 0.1 }}
      />
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={5.5}
        pathOptions={{ color: "#F3F4F6", weight: 2, fillColor: "#10B981", fillOpacity: 1 }}
      >
        <Tooltip direction="top" offset={[0, -6]} opacity={1}>
          <span className="text-[10.5px] font-semibold text-normal font-sans">HQ Patrol Base (Ramdaspeth)</span>
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
