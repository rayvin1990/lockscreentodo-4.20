import { NextRequest } from "next/server";
import { generateLockscreenImage } from "~/lib/og-render";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse parameters
    const template = searchParams.get("template") || "calm-list";
    const gradient = searchParams.get("gradient") || "linear-gradient(160deg, #20251f 0%, #4b5549 48%, #111318 100%)";
    const tasksParam = searchParams.get("tasks");
    const tasks = tasksParam ? tasksParam.split("|").slice(0, 4) : ["Task 1", "Task 2"];
    const heroMetric = searchParams.get("heroMetric") || undefined;
    const daysLeft = searchParams.get("daysLeft") || "days left";

    return generateLockscreenImage(tasks, template, gradient, heroMetric, daysLeft);
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}