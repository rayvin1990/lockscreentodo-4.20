import { NextRequest, NextResponse } from "next/server";
import { getUserByAgentApiKey, getLockscreenQueueForUser } from "~/lib/agent-db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const providedKey = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
                     req.nextUrl.searchParams.get("key") ||
                     req.headers.get("x-agent-api-key");

  if (!providedKey) {
    return new NextResponse("Unauthorized: Missing API Key", { status: 401 });
  }

  const device = await getUserByAgentApiKey(providedKey);
  if (!device) {
    return new NextResponse("Unauthorized: Invalid API Key", { status: 401 });
  }

  // Get the lockscreen queue for this user
  const queue = await getLockscreenQueueForUser(device.user_id);
  
  // Format tasks for the OG image API
  // The OG API expects tasks separated by |
  const tasks = queue.map(r => r.title).join("|");
  
  // Construct the OG image URL
  // We'll use the absolute URL to ensure it works from everywhere
  const ogUrl = new URL("/api/og/lockscreen", req.url);
  if (tasks) {
    ogUrl.searchParams.set("tasks", tasks);
  } else {
    ogUrl.searchParams.set("tasks", "No active reminders|Stay focused!");
  }
  
  // Optional: Add other styling parameters if needed
  ogUrl.searchParams.set("template", "calm-list");
  
  // Fetch the image from our OG route and return it directly
  const imageResponse = await fetch(ogUrl.toString());
  
  if (!imageResponse.ok) {
    return new NextResponse("Failed to generate image", { status: 500 });
  }

  const imageBuffer = await imageResponse.arrayBuffer();

  // Determine if we need Siri to speak
  let spokenText = "";
  const topReminder = queue[0];
  
  if (topReminder && device.tts_enabled) {
    // Parse user's timezone from query, default to Asia/Shanghai
    const tz = req.nextUrl.searchParams.get("tz") || "Asia/Shanghai";
    const isQuiet = isQuietHour(device.tts_quiet_hours_start || "22:00", device.tts_quiet_hours_end || "08:00", tz);
    
    // During quiet hours, only speak if critical. Otherwise speak high/critical.
    const canSpeak = isQuiet ? topReminder.priority === "critical" : ["high", "critical"].includes(topReminder.priority);
    
    if (canSpeak) {
      // Prioritize tts_text -> note (summary) -> title to desensitize payload
      const contentToSpeak = topReminder.tts_text || topReminder.note || topReminder.title;
      const prefix = topReminder.priority === "critical" ? "紧急提醒：" : "";
      spokenText = encodeURIComponent(`${prefix}${contentToSpeak}`);
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "image/png",
    "Cache-Control": "no-store, must-revalidate",
  };

  if (spokenText) {
    headers["X-Spoken-Text"] = spokenText;
  }

  return new NextResponse(imageBuffer, { headers });
}

function isQuietHour(start: string, end: string, timezone: string) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23'
    });
    
    const timeString = formatter.format(now);
    const [currentHourStr, currentMinuteStr] = timeString.split(':');
    const currentMinutes = parseInt(currentHourStr, 10) * 60 + parseInt(currentMinuteStr, 10);
    
    const [startHourStr, startMinuteStr] = start.split(':');
    const startMinutes = parseInt(startHourStr, 10) * 60 + parseInt(startMinuteStr, 10);
    
    const [endHourStr, endMinuteStr] = end.split(':');
    const endMinutes = parseInt(endHourStr, 10) * 60 + parseInt(endMinuteStr, 10);
    
    if (startMinutes > endMinutes) {
      return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
    } else {
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    }
  } catch (error) {
    console.error("[TTS] Timezone parse error", error);
    return false; // Fail open (not quiet) if timezone is invalid
  }
}
