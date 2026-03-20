const { spawnSync } = require("node:child_process");

const shouldSkipGenerate =
  process.env.CI === "true" ||
  process.env.CI === "1" ||
  process.env.EDGEONE === "true" ||
  process.env.EDGEONE_ENV ||
  process.env.SAASFLY_SKIP_PRISMA_GENERATE === "1";

if (shouldSkipGenerate) {
  console.log("[@saasfly/db] Skipping prisma generate during install in CI/managed build.");
  process.exit(0);
}

const commands = process.platform === "win32"
  ? [
      ["bunx.cmd", ["prisma", "generate"]],
      ["npx.cmd", ["prisma", "generate"]],
    ]
  : [
      ["bunx", ["prisma", "generate"]],
      ["npx", ["prisma", "generate"]],
    ];

for (const [command, args] of commands) {
  const result = spawnSync(command, args, {
    cwd: __dirname + "/..",
    stdio: "inherit",
    shell: false,
  });

  if (!result.error) {
    process.exit(result.status ?? 0);
  }
}

console.error("[@saasfly/db] Failed to run prisma generate with bunx or npx.");
process.exit(1);
