import { NextRequest } from "next/server";
import { generateLockscreenImage } from "~/lib/og-render";
import { getUserByAgentApiKey } from "~/lib/agent-db";
import { getLockscreenQueue } from "~/lib/agent-reminders";

// export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Auth & Real Data Fetching
    const apiKey = searchParams.get("apiKey");
    let tasks: string[] = [];
    let heroMetric: string | undefined = undefined;

    if (apiKey) {
      const device = await getUserByAgentApiKey(apiKey);
      if (device) {
        const queue = await getLockscreenQueue(device.user_id);
        tasks = queue.map(r => r.title);

        // If there's a critical task, use it as a hero metric placeholder or just show it top
        const critical = queue.find(r => r.priority === "critical");
        if (critical) {
          heroMetric = "CRITICAL";
        }
      }
    }

    // Fallback/Demo Data
    if (tasks.length === 0) {
      const tasksParam = searchParams.get("tasks");
      tasks = tasksParam ? tasksParam.split("|").slice(0, 4) : ["No active reminders", "Ready for agent tasks"];
    }

    const template = searchParams.get("template") || "calm-list";
    const gradient = searchParams.get("gradient") || "linear-gradient(160deg, #20251f 0%, #4b5549 48%, #111318 100%)";
    const daysLeft = searchParams.get("daysLeft") || "";

    return generateLockscreenImage(tasks, template, gradient, heroMetric, daysLeft);
  } catch (e: any) {
    console.error("OG Generation Error:", e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}