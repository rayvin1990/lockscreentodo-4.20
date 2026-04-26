import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";

const legacyEnvPaths = [
  join(process.cwd(), "lockscreentodo", ".env.local"),
  join(process.cwd(), "lockscreentodo", ".env"),
];

export function getServerEnvValue(key: string) {
  if (process.env[key]) {
    return process.env[key] || null;
  }

  for (const envPath of legacyEnvPaths) {
    const value = readEnvFileValue(envPath, key);
    if (value) return value;
  }

  return null;
}

function readEnvFileValue(filePath: string, key: string) {
  try {
    const contents = readFileSync(filePath, "utf8");
    const line = contents
      .split(/\r?\n/)
      .find((entry) => entry.trim().startsWith(`${key}=`));

    if (!line) return null;

    return line
      .slice(key.length + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
  } catch {
    return null;
  }
}
