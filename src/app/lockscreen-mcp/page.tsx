import { LockscreenMcpDebug } from "~/components/lockscreen-mcp-debug";

export const metadata = {
  title: "Lockscreen MCP Debug",
  description: "Debug console for agent-created lock screen reminders.",
};

export default function LockscreenMcpPage() {
  return <LockscreenMcpDebug />;
}
