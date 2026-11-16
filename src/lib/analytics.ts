type AnalyticsPayload = {
  event: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

export function trackEvent(event: string, properties?: AnalyticsPayload["properties"]) {
  if (typeof window === "undefined") return;

  // Forward to GA4 as a custom event when the gtag snippet is loaded
  // (production only — see RootLayout). Events show up in GA under the
  // event name, with payload keys as event parameters.
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") {
    try {
      // GA4 event parameters must not be null/undefined.
      const params: Record<string, string | number | boolean> = {};
      for (const [key, value] of Object.entries(properties ?? {})) {
        if (value != null) params[key] = value;
      }
      gtag("event", event, params);
    } catch (e) {
      console.warn("[trackEvent] gtag forward threw:", e);
    }
  }

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
