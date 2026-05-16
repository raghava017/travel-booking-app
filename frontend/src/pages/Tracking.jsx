import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import TrackingMap from "../components/TrackingMap";
import "../styles/Tracking.css";

function Tracking() {
  const [searchParams] = useSearchParams();
  const defaultScheduleId = searchParams.get("scheduleId") || "1";
  const [scheduleId, setScheduleId] = useState(defaultScheduleId);
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchLatest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleId]);

  const fetchLatest = () => {
    setLoading(true);
    api.get(`/api/tracking/schedule/${scheduleId}/latest`)
      .then((res) => setTracking(res.data))
      .catch(() => setTracking(null))
      .finally(() => setLoading(false));
  };

  return (
    <main className="tracking-page">
      <section className="tracking-controls">
        <label>
          Schedule ID
          <input value={scheduleId} onChange={(e) => setScheduleId(e.target.value)} />
        </label>
        <button onClick={fetchLatest} disabled={loading}>{loading ? "Loading..." : "Fetch latest"}</button>
      </section>

      <section className="tracking-map">
        {tracking ? (
          <TrackingMap
            latitude={tracking.latitude}
            longitude={tracking.longitude}
            updatedAt={tracking.updatedAt}
            speed={tracking.speed}
          />
        ) : (
          <div className="tracking-empty">No tracking data available for schedule {scheduleId}</div>
        )}
      </section>
    </main>
  );
}

export default Tracking;
