import { useEffect } from "react";
import { CircleMarker, MapContainer, Polyline, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";

import { hexFor } from "@/components/common/StatusBadge";
import { NAGPUR_CENTER } from "@/data/mockData";
import { useRaasta } from "@/lib/raasta/store";

function radiusFor(vehicles: number) {
  return 9 + Math.min(13, Math.round(vehicles / 90));
}

function MapEffects() {
  const map = useMap();
  const { selected, focusToken, route, userLocation } = useRaasta();

  useEffect(() => {
    if (!selected) return;
    map.flyTo([selected.latitude, selected.longitude], 14, { duration: 0.6 });
  }, [focusToken, selected, map]);

  useEffect(() => {
    if (!route) return;
    map.flyToBounds(route.path, { padding: [60, 60], duration: 0.6 });
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
  const { risk, selected, select, focusLocation, route, userLocation } = useRaasta();

  return (
    <MapContainer
      center={NAGPUR_CENTER}
      zoom={12}
      minZoom={10}
      maxZoom={17}
      zoomControl={false}
      attributionControl
      className="size-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; CARTO'
      />

      <MapEffects />

      {route ? (
        <>
          <Polyline positions={route.path} pathOptions={{ color: "#3B82F6", weight: 9, opacity: 0.18 }} />
          <Polyline positions={route.path} pathOptions={{ color: "#3B82F6", weight: 3.5, opacity: 0.95 }} />
        </>
      ) : null}

      {risk.map((r) => {
        const color = hexFor(r.risk_level);
        const isSelected = selected?.location === r.location;
        return (
          <CircleMarker
            key={r.location}
            center={[r.latitude, r.longitude]}
            radius={radiusFor(r.vehicle_count)}
            pathOptions={{
              color: isSelected ? "#3B82F6" : color,
              weight: isSelected ? 2.5 : 1.5,
              fillColor: color,
              fillOpacity: 0.28,
            }}
            eventHandlers={{ click: () => select(r.location) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <span className="text-[11px] font-semibold">{r.location.toUpperCase()}</span>
              <span className="text-[11px]"> · {r.risk_level}</span>
            </Tooltip>
            <Popup>
              <div className="min-w-40">
                <div className="text-[13px] font-semibold">{r.location}</div>
                <div className="mt-0.5" style={{ color }}>
                  {r.risk_level} · risk {r.risk_score.toFixed(1)}
                </div>
                <div className="mt-1 text-[11px] opacity-80">
                  {r.vehicle_count} vehicles · {r.accidents} accidents · congestion {r.congestion}/10
                </div>
                <button
                  type="button"
                  onClick={() => focusLocation(r.location)}
                  className="mt-2 border border-[#33383D] px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase"
                >
                  Select area
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={16}
        pathOptions={{ color: "#3B82F6", weight: 1, fillColor: "#3B82F6", fillOpacity: 0.12 }}
      />
      <CircleMarker
        center={[userLocation.latitude, userLocation.longitude]}
        radius={5}
        pathOptions={{ color: "#F3F4F6", weight: 2, fillColor: "#3B82F6", fillOpacity: 1 }}
      >
        <Tooltip direction="top" offset={[0, -6]} opacity={1}>
          <span className="text-[11px]">Current location (mock)</span>
        </Tooltip>
      </CircleMarker>
    </MapContainer>
  );
}
