#!/usr/bin/env node

import { existsSync, readFileSync, readSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";

const args = new Set(process.argv.slice(2));
const root = process.cwd();

const PLACEHOLDER_RE =
  /^(your|example|sample|test|todo|xxx|changeme|replace_me|placeholder|dummy|fake|redacted|<.*>|\$\{.*\})[\w-]*$/i;

const SECRET_NAME_RE =
  /\b(api[_-]?key|secret|token|password|passwd|pwd|private[_-]?key|client[_-]?secret|access[_-]?key|auth[_-]?token|webhook)\b/i;

const SPECIFIC_PATTERNS = [
  {
    id: "private-key",
    label: "Private key block",
    regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/,
  },
  {
    id: "aws-access-key",
    label: "AWS access key",
    regex: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  },
  {
    id: "openai-key",
    label: "OpenAI API key",
    regex: /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}\b/,
  },
  {
    id: "github-token",
    label: "GitHub token",
    regex: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{20,}\b/,
  },
  {
    id: "slack-token",
    label: "Slack token",
    regex: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/,
  },
  {
    id: "stripe-key",
    label: "Stripe secret key",
    regex: /\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{16,}\b/,
  },
  {
    id: "jwt",
    label: "JWT-like token",
    regex: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/,
  },
  {
    id: "database-url",
    label: "Database connection URL",
    regex:
      /\b(?:postgres|postgresql|mysql|mongodb(?:\+srv)?|redis):\/\/[^:\s]+:[^@\s]+@[^)\s'"]+/i,
  },
];

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    windowsHide: true,
  });

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || "git command failed").trim());
  }

  return result.stdout;
}

function getStagedDiff() {
  return runGit(["diff", "--cached", "--no-ext-diff", "--unified=0", "--", "."]);
}

function getPushDiff() {
  const ranges = readPrePushRanges();
  if (ranges.length === 0) {
    return "";
  }

  return ranges.map((range) => runGit(["diff", "--no-ext-diff", "--unified=0", range])).join("\n");
}

function getTrackedFiles() {
  return runGit(["ls-files", "-z"])
    .split("\0")
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !shouldSkipFile(file));
}

function readPrePushRanges() {
  if (process.stdin.isTTY) {
    const upstream = spawnSync("git", ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{u}"], {
      cwd: root,
      encoding: "utf8",
      windowsHide: true,
    });

    if (upstream.status === 0) {
      return [`${upstream.stdout.trim()}..HEAD`];
    }

    return ["HEAD"];
  }

  const input = readStdin();
  const zero = "0000000000000000000000000000000000000000";
  const ranges = [];

  for (const line of input.split(/\r?\n/)) {
    const parts = line.trim().split(/\s+/);
    if (parts.length < 4) continue;

    const localSha = parts[1];
    const remoteSha = parts[3];

    if (!localSha || localSha === zero) continue;
    if (!remoteSha || remoteSha === zero) {
      ranges.push(localSha);
      continue;
    }

    ranges.push(`${remoteSha}..${localSha}`);
  }

  return ranges;
}

function readStdin() {
  const chunks = [];
  const buffer = Buffer.alloc(4096);
  let bytesRead = 0;

  try {
    while ((bytesRead = process.stdin.fd !== undefined ? readSync(process.stdin.fd, buffer, 0, buffer.length, null) : 0) > 0) {
      chunks.push(Buffer.from(buffer.subarray(0, bytesRead)));
    }
  } catch {
    return "";
  }

  return Buffer.concat(chunks).toString("utf8");
}

function shouldSkipFile(filePath) {
  return (
    filePath === "package-lock.json" ||
    filePath === "bun.lock" ||
    /\.(png|jpe?g|gif|webp|ico|pdf)$/i.test(filePath)
  );
}

function shannonEntropy(value) {
  if (!value) return 0;
  const counts = new Map();
  for (const char of value) counts.set(char, (counts.get(char) || 0) + 1);

  let entropy = 0;
  for (const count of counts.values()) {
    const probability = count / value.length;
    entropy -= probability * Math.log2(probability);
  }
  return entropy;
}

function normalizeCandidate(value) {
  return value
    .trim()
    .replace(/^[`'"]+|[`'",;]+$/g, "")
    .replace(/^Bearer\s+/i, "");
}

function extractAssignedValue(line) {
  const match = line.match(
    /\b[A-Za-z_][A-Za-z0-9_]*(?:API[_-]?KEY|SECRET|TOKEN|PASSWORD|PASSWD|PWD|PRIVATE[_-]?KEY|CLIENT[_-]?SECRET|ACCESS[_-]?KEY|AUTH[_-]?TOKEN|WEBHOOK)[A-Za-z0-9_]*\b\s*[:=]\s*([^\s#]+)/i,
  );
  if (!match) return null;
  return normalizeCandidate(match[1]);
}

function isSecretLikeValue(value) {
  const clean = normalizeCandidate(value);
  if (isLikelyPlaceholder(clean)) return false;
  if (/^(true|false|null|undefined|present|missing|yes|no)$/i.test(clean)) return false;
  if (/[\[\]()?]/.test(clean)) return false;
  if (/^[A-Za-z_$][\w$]*(?:\.[\w$]+|\?\.[\w$]+|\(\))*$/i.test(clean)) return false;
  if (/^z\.string\(\)/i.test(clean)) return false;
  if (/^https?:\/\//i.test(clean) && !/[:@].+@/.test(clean)) return false;
  return clean.length >= 20 && shannonEntropy(clean) >= 3.5;
}

function isLikelyPlaceholder(value) {
  const clean = normalizeCandidate(value);
  return (
    !clean ||
    clean.length < 12 ||
    PLACEHOLDER_RE.test(clean) ||
    /^process\.env\./i.test(clean) ||
    /^import\.meta\.env\./i.test(clean) ||
    /^env\(/i.test(clean)
  );
}

function redact(value) {
  const clean = normalizeCandidate(value);
  if (clean.length <= 12) return "[redacted]";
  return `${clean.slice(0, 4)}...${clean.slice(-4)}`;
}

function scanLine(line) {
  const findings = [];

  for (const pattern of SPECIFIC_PATTERNS) {
    const match = line.match(pattern.regex);
    if (match) {
      findings.push({
        id: pattern.id,
        label: pattern.label,
        sample: redact(match[0]),
      });
    }
  }

  const assigned = extractAssignedValue(line);
  if (assigned && isSecretLikeValue(assigned)) {
    findings.push({
      id: "secret-assignment",
      label: "Sensitive-looking assignment",
      sample: redact(assigned),
    });
  }

  const bearer = line.match(/\bBearer\s+([A-Za-z0-9._~+/=-]{20,})\b/i);
  if (bearer && !isLikelyPlaceholder(bearer[1]) && shannonEntropy(bearer[1]) >= 3.5) {
    findings.push({
      id: "bearer-token",
      label: "Bearer token",
      sample: redact(bearer[1]),
    });
  }

  if (SECRET_NAME_RE.test(line)) {
    const quoted = line.match(/["'`]([A-Za-z0-9_./+=:-]{24,})["'`]/);
    if (
      quoted &&
      !isLikelyPlaceholder(quoted[1]) &&
      !/^https?:\/\//i.test(quoted[1]) &&
      shannonEntropy(quoted[1]) >= 3.8
    ) {
      findings.push({
        id: "high-entropy-secret",
        label: "High-entropy value near sensitive name",
        sample: redact(quoted[1]),
      });
    }
  }

  return findings;
}

function parseDiff(diff) {
  const findings = [];
  let currentFile = null;
  let newLine = 0;

  for (const rawLine of diff.split(/\r?\n/)) {
    if (rawLine.startsWith("+++ b/")) {
      currentFile = rawLine.slice(6);
      continue;
    }

    const hunk = rawLine.match(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
    if (hunk) {
      newLine = Number(hunk[1]);
      continue;
    }

    if (!currentFile || rawLine.startsWith("+++") || rawLine.startsWith("---")) {
      continue;
    }

    if (rawLine.startsWith("+")) {
      if (shouldSkipFile(currentFile)) {
        newLine += 1;
        continue;
      }

      const content = rawLine.slice(1);
      for (const finding of scanLine(content)) {
        findings.push({
          ...finding,
          file: currentFile,
          line: newLine,
          content,
        });
      }
      newLine += 1;
      continue;
    }

    if (!rawLine.startsWith("-")) {
      newLine += 1;
    }
  }

  return findings;
}

function scanFiles(files) {
  const findings = [];

  for (const file of files) {
    let content = "";
    try {
      content = readFileSync(join(root, file), "utf8");
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      for (const finding of scanLine(lines[index])) {
        findings.push({
          ...finding,
          file,
          line: index + 1,
          content: lines[index],
        });
      }
    }
  }

  return findings;
}

function printFindings(findings, mode) {
  const action = mode === "push" ? "push" : mode === "all" ? "check" : "commit";
  console.error(`\nSecret Guard blocked this ${action}.`);
  console.error("Remove the sensitive value from staged changes or replace it with an env reference.\n");

  for (const finding of findings) {
    console.error(`- ${finding.file}:${finding.line} ${finding.label} (${finding.id})`);
    console.error(`  sample: ${finding.sample}`);
  }

  console.error("\nIf this is a false positive, move the value to an environment variable or adjust the scanner deliberately.");
}

function installHook() {
  const preCommitPath = join(root, ".git", "hooks", "pre-commit");
  const prePushPath = join(root, ".git", "hooks", "pre-push");
  const preCommitBody = `#!/bin/sh
node scripts/secret-guard.mjs --staged
`;
  const prePushBody = `#!/bin/sh
node scripts/secret-guard.mjs --push
`;

  if (!existsSync(dirname(preCommitPath))) {
    throw new Error(".git/hooks does not exist. Run this from the repository root.");
  }

  writeFileSync(preCommitPath, preCommitBody, { encoding: "utf8", mode: 0o755 });
  writeFileSync(prePushPath, prePushBody, { encoding: "utf8", mode: 0o755 });
  console.log(`Installed pre-commit hook at ${preCommitPath}`);
  console.log(`Installed pre-push hook at ${prePushPath}`);
}

function main() {
  if (args.has("--install-hook")) {
    installHook();
    return;
  }

  const mode = args.has("--all") ? "all" : args.has("--push") ? "push" : "staged";
  if (mode === "all") {
    const files = getTrackedFiles();
    const findings = scanFiles(files);
    if (findings.length > 0) {
      printFindings(findings, mode);
      process.exit(1);
    }

    console.log(`Secret Guard: ${files.length} tracked files passed.`);
    return;
  }

  const diff = mode === "push" ? getPushDiff() : getStagedDiff();
  if (!diff.trim()) {
    console.log(`Secret Guard: no ${mode} changes to scan.`);
    return;
  }

  const findings = parseDiff(diff);
  if (findings.length > 0) {
    printFindings(findings, mode);
    process.exit(1);
  }

  console.log(`Secret Guard: ${mode} changes passed.`);
}

try {
  main();
} catch (error) {
  console.error(`Secret Guard failed: ${error.message}`);
  process.exit(2);
}
