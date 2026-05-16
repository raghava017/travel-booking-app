function TrackingMap({ latitude, longitude, updatedAt, speed }) {
  const lat = latitude || 17.385;
  const lon = longitude || 78.4867;
  const zoom = 12;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=${zoom}/${lat}/${lon}`;

  return (
    <div style={{ height: '60vh', width: '100%' }}>
      <iframe
        title="Tracking Map"
        src={osmUrl}
        style={{ border: 0, width: '100%', height: '100%' }}
      />
      <div style={{ marginTop: 8, color: '#444' }}>
        Updated: {updatedAt ? new Date(updatedAt).toLocaleString() : 'N/A'} • Speed: {speed || 0} km/h
      </div>
    </div>
  );
}

export default TrackingMap;
