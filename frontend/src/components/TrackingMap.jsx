import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function TrackingMap({ latitude, longitude, updatedAt, speed, busName, sourceCity, destinationCity, history }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);

  const lat = latitude || 17.385;
  const lon = longitude || 78.4867;

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView([lat, lon], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(mapInstanceRef.current);
    }

    const map = mapInstanceRef.current;
    map.setView([lat, lon], map.getZoom());

    if (markerRef.current) {
      markerRef.current.remove();
    }

    const busIcon = L.divIcon({
      className: "bus-marker",
      html: `<div class="bus-marker-inner">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="#e53935"><path d="M4 16c0 .88.39 1.67 1 2.22V20c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h8v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1.78c.61-.55 1-1.34 1-2.22V6c0-3.5-3.58-4-8-4s-8 .5-8 4v10zm3.5 1c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm9 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-6H6V6h12v5z"/></svg>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
    });

    markerRef.current = L.marker([lat, lon], { icon: busIcon })
      .addTo(map)
      .bindPopup(
        `<strong>${busName || "Bus"}</strong><br/>
         ${sourceCity || ""} → ${destinationCity || ""}<br/>
         Speed: ${Math.round(speed || 0)} km/h<br/>
         Updated: ${updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"}`
      )
      .openPopup();

    // Draw route trail from history
    if (history && history.length > 1) {
      const sorted = [...history].sort(
        (a, b) => new Date(a.updatedAt) - new Date(b.updatedAt)
      );
      const latlngs = sorted.map((p) => [p.latitude, p.longitude]);
      L.polyline(latlngs, { color: "#1976d2", weight: 3, opacity: 0.7, dashArray: "8 4" }).addTo(map);

      // Fit bounds to show full route trail
      const bounds = L.latLngBounds(latlngs);
      bounds.extend([lat, lon]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    return () => {};
  }, [lat, lon, speed, updatedAt, busName, sourceCity, destinationCity, history]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      <div ref={mapRef} style={{ height: "55vh", width: "100%", borderRadius: "8px" }} />
      <div style={{ marginTop: 8, color: "#555", fontSize: "0.9rem" }}>
        Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : "N/A"} &bull; Speed: {Math.round(speed || 0)} km/h
        &bull; Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
      </div>
    </div>
  );
}

export default TrackingMap;
