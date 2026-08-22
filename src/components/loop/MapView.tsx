import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import type { Listing } from "@/lib/loop-data";

function pinIcon(intent: Listing["intent"]) {
  const color = intent === "ofrezco" ? "#009DFF" : "#FF8C00";
  return L.divIcon({
    className: "loop-pin",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px;background:${color};box-shadow:0 0 0 6px ${color}33,0 2px 6px rgba(0,0,0,.25);border:2px solid #fff"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
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

export default function MapView({
  listings,
  onSelect,
}: {
  listings: Listing[];
  onSelect: (l: Listing) => void;
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
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      {listings.map((l) => (
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
