import { getServerEnvValue } from "./server-env";
import type { AgentReminder } from "./agent-reminders";

export type NotificationProvider = "bark" | "pushcut" | "none";

export interface PushNotificationParams {
  title: string;
  body: string;
  url?: string;
  group?: string;
  level?: "active" | "timeSensitive" | "passive";
  priority?: string;
  kind?: string;
}

export async function sendPushNotification(
  provider: NotificationProvider,
  target: string, // Bark Key or Pushcut Secret
  params: PushNotificationParams
) {
  if (provider === "none" || !target) return;

  try {
    if (provider === "bark") {
      await sendBarkNotification(target, params);
    } else if (provider === "pushcut") {
      await sendPushcutNotification(target, params);
    }
  } catch (error) {
    console.error(`[Notification] Failed to send via ${provider}:`, error);
  }
}

function getBarkSound(priority?: string, kind?: string): string {
  // Bark supported sounds: https://github.com/Finb/Bark/tree/master/Sounds
  if (priority === "critical") return "alarm";
  
  switch (kind) {
    case "medication": return "healthnotification";
    case "payment": return "cashregister";
    case "travel": return "flight";
    case "appointment": return "calypso";
  }

  if (priority === "high") return "minuet";
  
  // Default soft sound for medium/low
  return "glass"; 
}

async function sendBarkNotification(key: string, params: PushNotificationParams) {
  const baseUrl = getServerEnvValue("BARK_SERVER_URL") || "https://api.day.app";
  const url = new URL(`${baseUrl}/${key}/${encodeURIComponent(params.title)}/${encodeURIComponent(params.body)}`);
  
  if (params.url) url.searchParams.set("url", params.url);
  if (params.group) url.searchParams.set("group", params.group);
  if (params.level) url.searchParams.set("level", params.level === "timeSensitive" ? "timeSensitive" : "active");
  
  const sound = getBarkSound(params.priority, params.kind);
  if (sound) url.searchParams.set("sound", sound);
  
  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Bark responded with ${response.status}`);
  }
}

async function sendPushcutNotification(secret: string, params: PushNotificationParams) {
  // Pushcut Smart Notification API
  // Pushcut handles sounds via their app config, but we can pass priority
  const response = await fetch(`https://api.pushcut.io/v1/notifications/${secret}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: params.title,
      text: params.body,
      link: params.url,
      // Map our priority to Pushcut's implicit priority concepts if needed later
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Pushcut responded with ${response.status}`);
  }
}
