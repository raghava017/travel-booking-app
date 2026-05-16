import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import TrackingMap from "../components/TrackingMap";
import "../styles/Tracking.css";

const now = new Date();
const DEMO_TRACKINGS = [
  {
    scheduleId: 1,
    busName: "AbhiBus Swiftline",
    busNumber: "TS-09-AB-2048",
    busType: "AC SLEEPER",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    estimatedDuration: "8h 45m",
    distanceKm: 570.0,
    departureTime: new Date(now.getTime() - 4 * 3600000).toISOString(),
    arrivalTime: new Date(now.getTime() + 5 * 3600000).toISOString(),
    fare: 899.0,
    latitude: 15.8,
    longitude: 77.8,
    speed: 62,
    status: "IN_TRANSIT",
    lastUpdated: new Date(now.getTime() - 120000).toISOString(),
    trackingId: "TRK-1",
  },
  {
    scheduleId: 2,
    busName: "Orange Tours Platinum",
    busNumber: "AP-16-OT-7766",
    busType: "AC SLEEPER",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    estimatedDuration: "8h 45m",
    distanceKm: 570.0,
    departureTime: new Date(now.getTime() - 3 * 3600000).toISOString(),
    arrivalTime: new Date(now.getTime() + 6 * 3600000).toISOString(),
    fare: 1049.0,
    latitude: 16.5,
    longitude: 78.0,
    speed: 55,
    status: "IN_TRANSIT",
    lastUpdated: new Date(now.getTime() - 180000).toISOString(),
    trackingId: "TRK-2",
  },
  {
    scheduleId: 3,
    busName: "Kaveri Travels Smart",
    busNumber: "KA-05-KT-1188",
    busType: "AC SLEEPER",
    sourceCity: "Hyderabad",
    destinationCity: "Bangalore",
    estimatedDuration: "8h 45m",
    distanceKm: 570.0,
    departureTime: new Date(now.getTime() - 5 * 3600000).toISOString(),
    arrivalTime: new Date(now.getTime() + 4 * 3600000).toISOString(),
    fare: 749.0,
    latitude: 14.5,
    longitude: 77.7,
    speed: 48,
    status: "IN_TRANSIT",
    lastUpdated: new Date(now.getTime() - 300000).toISOString(),
    trackingId: "TRK-3",
  },
  {
    scheduleId: 4,
    busName: "VRL Value Express",
    busNumber: "MH-12-VL-5102",
    busType: "NON-AC",
    sourceCity: "Mumbai",
    destinationCity: "Pune",
    estimatedDuration: "3h 15m",
    distanceKm: 150.0,
    departureTime: new Date(now.getTime() - 1.5 * 3600000).toISOString(),
    arrivalTime: new Date(now.getTime() + 2 * 3600000).toISOString(),
    fare: 399.0,
    latitude: 18.75,
    longitude: 73.25,
    speed: 70,
    status: "IN_TRANSIT",
    lastUpdated: new Date(now.getTime() - 60000).toISOString(),
    trackingId: "TRK-4",
  },
];

function buildDemoHistory(tracking) {
  const waypoints =
    tracking.sourceCity === "Mumbai"
      ? [
          { lat: 19.076, lon: 72.878 },
          { lat: 18.95, lon: 73.05 },
          { lat: 18.85, lon: 73.15 },
          { lat: 18.75, lon: 73.25 },
        ]
      : [
          { lat: 17.385, lon: 78.487 },
          { lat: 17.0, lon: 78.2 },
          { lat: 16.5, lon: 78.0 },
          { lat: 15.8, lon: 77.8 },
          { lat: 15.3, lon: 77.6 },
          { lat: 14.5, lon: 77.7 },
        ];

  const progressIdx = Math.min(
    waypoints.length - 1,
    Math.floor((tracking.scheduleId / 4) * waypoints.length)
  );

  return waypoints.slice(0, progressIdx + 1).map((wp, i) => ({
    id: tracking.scheduleId * 100 + i,
    latitude: wp.lat + (Math.random() - 0.5) * 0.01,
    longitude: wp.lon + (Math.random() - 0.5) * 0.01,
    speed: 40 + Math.random() * 40,
    status: "IN_TRANSIT",
    updatedAt: new Date(now.getTime() - (progressIdx - i) * 1800000).toISOString(),
  }));
}

function Tracking() {
  const [searchParams] = useSearchParams();
  const defaultScheduleId = searchParams.get("scheduleId") || "";
  const [scheduleId, setScheduleId] = useState(defaultScheduleId);
  const [trackingDetails, setTrackingDetails] = useState(null);
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [activeTrackings, setActiveTrackings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [view, setView] = useState(defaultScheduleId ? "detail" : "list");

  const applyFallback = useCallback((listData) => {
    if (!listData || listData.length === 0) {
      setActiveTrackings(DEMO_TRACKINGS);
    } else {
      setActiveTrackings(listData);
    }
  }, []);

  const applyDetailFallback = useCallback((id) => {
    const demo = DEMO_TRACKINGS.find((t) => String(t.scheduleId) === String(id));
    if (demo) {
      setTrackingDetails(demo);
      setTrackingHistory(buildDemoHistory(demo));
      setView("detail");
    } else {
      setTrackingDetails(null);
      setTrackingHistory([]);
    }
  }, []);

  const fetchActiveTrackings = useCallback(() => {
    api.get("/tracking/active")
      .then((res) => applyFallback(res.data))
      .catch(() => applyFallback(null));
  }, [applyFallback]);

  const fetchTrackingDetails = useCallback(() => {
    if (!scheduleId) return;
    setLoading(true);
    Promise.all([
      api.get(`/tracking/schedule/${scheduleId}/details`),
      api.get(`/tracking/schedule/${scheduleId}`)
    ])
      .then(([detailsRes, historyRes]) => {
        if (detailsRes.data && detailsRes.data.scheduleId) {
          setTrackingDetails(detailsRes.data);
          setTrackingHistory(historyRes.data || []);
          setView("detail");
        } else {
          applyDetailFallback(scheduleId);
        }
      })
      .catch(() => {
        applyDetailFallback(scheduleId);
      })
      .finally(() => setLoading(false));
  }, [scheduleId, applyDetailFallback]);

  useEffect(() => {
    fetchActiveTrackings();
  }, [fetchActiveTrackings]);

  useEffect(() => {
    if (!scheduleId) return;
    let cancelled = false;
    api.get(`/tracking/schedule/${scheduleId}/details`)
      .then((detailsRes) => {
        if (cancelled) return;
        if (detailsRes.data && detailsRes.data.scheduleId) {
          return api.get(`/tracking/schedule/${scheduleId}`).then((historyRes) => {
            if (cancelled) return;
            setTrackingDetails(detailsRes.data);
            setTrackingHistory(historyRes.data || []);
            setView("detail");
          });
        } else {
          applyDetailFallback(scheduleId);
        }
      })
      .catch(() => {
        if (!cancelled) {
          applyDetailFallback(scheduleId);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [scheduleId, applyDetailFallback]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      if (view === "detail" && scheduleId) {
        fetchTrackingDetails();
      } else {
        fetchActiveTrackings();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, view, scheduleId, fetchTrackingDetails, fetchActiveTrackings]);

  const handleSelectSchedule = (id) => {
    setScheduleId(String(id));
    setView("detail");
  };

  const handleBackToList = () => {
    setView("list");
    setTrackingDetails(null);
    setTrackingHistory([]);
    setScheduleId("");
    fetchActiveTrackings();
  };

  const formatDate = (value) => {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_TRANSIT": return "#2196f3";
      case "COMPLETED": return "#4caf50";
      case "CANCELLED": return "#f44336";
      case "SCHEDULED": return "#ff9800";
      default: return "#9e9e9e";
    }
  };

  return (
    <main className="tracking-page">
      <section className="tracking-header">
        <div>
          <p>Live GPS Tracking</p>
          <h1>Track Your Bus</h1>
          <span>Real-time location updates for all active buses.</span>
        </div>
        <div className="tracking-header-actions">
          <label className="auto-refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh (10s)
          </label>
        </div>
      </section>

      {view === "list" ? (
        <>
          <section className="tracking-search-bar">
            <input
              type="text"
              placeholder="Enter Schedule ID or Tracking ID (e.g. TRK-1)"
              value={scheduleId}
              onChange={(e) => setScheduleId(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") fetchTrackingDetails(); }}
            />
            <button onClick={fetchTrackingDetails} disabled={loading || !scheduleId}>
              {loading ? "Searching..." : "Track"}
            </button>
          </section>

          <section className="active-trackings">
            <h2>Active Buses ({activeTrackings.length})</h2>
            {activeTrackings.length === 0 ? (
              <div className="tracking-empty">No active buses to track at the moment.</div>
            ) : (
              <div className="tracking-grid">
                {activeTrackings.map((t) => (
                  <article
                    key={t.scheduleId}
                    className="tracking-card"
                    onClick={() => handleSelectSchedule(t.scheduleId)}
                  >
                    <div className="tracking-card-top">
                      <div>
                        <h3>{t.busName || "Bus"}</h3>
                        <p className="bus-number">{t.busNumber}</p>
                      </div>
                      <span
                        className="status-badge"
                        style={{ background: getStatusColor(t.status) }}
                      >
                        {t.status || "UNKNOWN"}
                      </span>
                    </div>
                    <div className="tracking-card-route">
                      <span className="route-city">{t.sourceCity}</span>
                      <span className="route-arrow">&rarr;</span>
                      <span className="route-city">{t.destinationCity}</span>
                    </div>
                    <div className="tracking-card-info">
                      <div><span>Speed</span><strong>{Math.round(t.speed || 0)} km/h</strong></div>
                      <div><span>Type</span><strong>{t.busType || "N/A"}</strong></div>
                      <div><span>Duration</span><strong>{t.estimatedDuration || "N/A"}</strong></div>
                      <div><span>Updated</span><strong>{formatDate(t.lastUpdated)}</strong></div>
                    </div>
                    <button className="track-btn">View Live Location</button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </>
      ) : (
        <>
          <section className="tracking-detail-header">
            <button className="back-btn" onClick={handleBackToList}>&larr; All Buses</button>
            {trackingDetails && (
              <div className="detail-bus-info">
                <h2>{trackingDetails.busName || "Bus"}</h2>
                <span className="bus-number">{trackingDetails.busNumber}</span>
                <span
                  className="status-badge"
                  style={{ background: getStatusColor(trackingDetails.status) }}
                >
                  {trackingDetails.status}
                </span>
              </div>
            )}
          </section>

          {loading ? (
            <div className="tracking-empty">Loading tracking data...</div>
          ) : trackingDetails ? (
            <>
              <section className="tracking-detail-info">
                <div className="detail-route">
                  <div className="route-endpoint">
                    <span className="dot green"></span>
                    <div>
                      <strong>{trackingDetails.sourceCity}</strong>
                      <small>{formatDate(trackingDetails.departureTime)}</small>
                    </div>
                  </div>
                  <div className="route-line">
                    <span>{trackingDetails.distanceKm} km &bull; {trackingDetails.estimatedDuration}</span>
                  </div>
                  <div className="route-endpoint">
                    <span className="dot red"></span>
                    <div>
                      <strong>{trackingDetails.destinationCity}</strong>
                      <small>{formatDate(trackingDetails.arrivalTime)}</small>
                    </div>
                  </div>
                </div>
                <div className="detail-stats">
                  <div><span>Speed</span><strong>{Math.round(trackingDetails.speed || 0)} km/h</strong></div>
                  <div><span>Bus Type</span><strong>{trackingDetails.busType}</strong></div>
                  <div><span>Fare</span><strong>Rs {Math.round(trackingDetails.fare || 0)}</strong></div>
                  <div><span>Tracking ID</span><strong>{trackingDetails.trackingId}</strong></div>
                  <div><span>Last Updated</span><strong>{formatDate(trackingDetails.lastUpdated)}</strong></div>
                </div>
              </section>

              <section className="tracking-map-section">
                <h3>Live Location</h3>
                <TrackingMap
                  latitude={trackingDetails.latitude}
                  longitude={trackingDetails.longitude}
                  speed={trackingDetails.speed}
                  updatedAt={trackingDetails.lastUpdated}
                  busName={trackingDetails.busName}
                  sourceCity={trackingDetails.sourceCity}
                  destinationCity={trackingDetails.destinationCity}
                  history={trackingHistory}
                />
              </section>

              {trackingHistory.length > 0 && (
                <section className="tracking-timeline">
                  <h3>Tracking Timeline ({trackingHistory.length} updates)</h3>
                  <div className="timeline">
                    {trackingHistory.map((point, idx) => (
                      <div key={point.id || idx} className="timeline-item">
                        <div className="timeline-dot"></div>
                        <div className="timeline-content">
                          <strong>{formatDate(point.updatedAt)}</strong>
                          <p>
                            Lat: {point.latitude?.toFixed(4)}, Lon: {point.longitude?.toFixed(4)}
                            &nbsp;&bull;&nbsp;Speed: {Math.round(point.speed || 0)} km/h
                            &nbsp;&bull;&nbsp;{point.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </>
          ) : (
            <div className="tracking-empty">
              <h2>No tracking data found</h2>
              <p>No tracking data available for schedule {scheduleId}. The bus may not have started yet.</p>
              <button className="back-btn" onClick={handleBackToList}>Browse Active Buses</button>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default Tracking;
