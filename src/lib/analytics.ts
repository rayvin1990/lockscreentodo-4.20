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

  console.log("[trackEvent]", event, JSON.stringify(properties || {}));

  if (navigator.sendBeacon) {
    try {
      const sent = navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      console.log("[trackEvent] sendBeacon returned:", sent);
    } catch (e) {
      console.warn("[trackEvent] sendBeacon threw:", e);
    }
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).then((r) => {
    console.log("[trackEvent] fetch response status:", r.status);
  }).catch((e) => {
    console.warn("[trackEvent] fetch threw:", e);
  });
}
