type AnalyticsPayload = {
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function trackEvent(event: string, properties?: AnalyticsPayload["properties"]) {
  if (typeof window === "undefined") return;

  const payload = JSON.stringify({
    event,
    properties,
    path: window.location.pathname,
    referrer: document.referrer || null,
    timestamp: new Date().toISOString(),
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}
