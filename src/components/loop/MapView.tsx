import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { Listing } from "@/lib/loop-data";
import { LOOP_NODES } from "@/lib/loop-nodes";

function pinIcon(intent: Listing["intent"]) {
  const color = intent === "ofrezco" ? "#009DFF" : "#FF8C00";
  return L.divIcon({
    className: "loop-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 6px ${color}33,0 2px 6px rgba(0,0,0,.25);border:2px solid #fff"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
}

function nodeIcon() {
  return L.divIcon({
    className: "loop-node-pin",
    html: `<span style="display:grid;place-items:center;width:28px;height:28px;border-radius:10px;background:#0F172A;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3)">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="#4ADE80"><path d="M3 21V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v11h-6v-4h-2v4H3Zm4-4v2h2v-2H7Zm0-4v2h2v-2H7Zm0-4v2h2V9H7Zm4 0v2h2V9h-2Zm0 4v2h2v-2h-2Z"/></svg>
    </span>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function Resizer() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);
  return null;
}

function FlyTo({ target }: { target: Listing | null }) {
  const map = useMap();
  useEffect(() => {
    if (!target || typeof target.lat !== "number" || typeof target.lng !== "number") return;
    const t = setTimeout(() => {
      map.invalidateSize();
      map.flyTo([target.lat, target.lng], 15, { duration: 1.2 });
    }, 220);
    return () => clearTimeout(t);
  }, [map, target]);
  return null;
}

export default function MapView({
  listings,
  onSelect,
  focus = null,
  showNodes = true,
}: {
  listings: Listing[];
  onSelect: (l: Listing) => void;
  focus?: Listing | null;
  showNodes?: boolean;
}) {
  return (
    <MapContainer
      center={[-24.79, -65.41]}
      zoom={11}
      scrollWheelZoom
      className="h-full w-full"
      style={{ background: "transparent" }}
    >
      <Resizer />
      <FlyTo target={focus} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {showNodes
        ? LOOP_NODES.map((n) => (
            <Marker key={n.id} position={[n.lat, n.lng]} icon={nodeIcon()} title={n.name}>
              <Tooltip direction="top" offset={[0, -12]}>
                {n.name} · {n.detail}
              </Tooltip>
            </Marker>
          ))
        : null}
      {listings
        .filter((l) => typeof l.lat === "number" && typeof l.lng === "number")
        .map((l) => (
          <Marker
            key={l.id}
            position={[l.lat, l.lng]}
            icon={pinIcon(l.intent)}
            eventHandlers={{ click: () => onSelect(l) }}
            title={l.title}
          />
        ))}
    </MapContainer>
  );
}
