import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
import path from "node:path";
import os from "node:os";

const workspaceRoot = "C:/Users/57684/saasfly";
const sourceStateDir = path.join(os.homedir(), ".openclaw");
const derivedStateDir = path.join(workspaceRoot, "tmp", "openclaw-acp-state");
const derivedConfigPath = path.join(derivedStateDir, "openclaw.json");
const derivedTokenPath = path.join(derivedStateDir, "gateway.token");

function prepareAcpState() {
  mkdirSync(derivedStateDir, { recursive: true });

  const sourceConfigPath = path.join(sourceStateDir, "openclaw.json");
  const sourceConfigText = readFileSync(sourceConfigPath, "utf8").replace(/^\uFEFF/, "");
  const parsed = JSON.parse(sourceConfigText);
  const gateway = parsed?.gateway ?? {};
  const port = String(gateway.port ?? 18789);
  const token = String(gateway?.auth?.token ?? gateway.token ?? "").trim();

  if (!token) {
    throw new Error(`Missing gateway token in ${sourceConfigPath}`);
  }

  const derived = {
    ...parsed,
    bindings: [],
    channels: {},
    plugins: {
      ...(parsed?.plugins ?? {}),
      allow: ["acpx"]
    }
  };

  writeFileSync(derivedConfigPath, `${JSON.stringify(derived, null, 2)}\n`, "utf8");
  writeFileSync(derivedTokenPath, `${token}\n`, "utf8");

  return { port };
}

const openclawCli = path.join(
  process.env.APPDATA ?? path.join(os.homedir(), "AppData", "Roaming"),
  "npm",
  "node_modules",
  "openclaw",
  "openclaw.mjs"
);

const { port } = prepareAcpState();
const child = spawn(
  process.execPath,
  [
    openclawCli,
    "acp",
    "--url",
    `ws://127.0.0.1:${port}`,
    "--token-file",
    derivedTokenPath,
    "--session",
    "agent:nia:acp"
  ],
  {
    stdio: ["pipe", "pipe", "pipe"],
    env: {
      ...process.env,
      OPENCLAW_HIDE_BANNER: "1",
      OPENCLAW_SUPPRESS_NOTES: "1",
      OPENCLAW_SKIP_CHANNELS: "1",
      OPENCLAW_STATE_DIR: derivedStateDir,
      OPENCLAW_CONFIG_PATH: derivedConfigPath
    }
  }
);

process.stdin.pipe(child.stdin);
child.stdout.pipe(process.stdout);
child.stderr.pipe(process.stderr);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

child.on("error", (error) => {
  process.stderr.write(`${String(error)}\n`);
  process.exit(1);
});
