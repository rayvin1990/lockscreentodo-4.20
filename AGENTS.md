<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shared-brain-rules -->
# Shared Obsidian Brain Protocol

This repo uses `.brain/` as a shared Obsidian vault for agents and humans.

Before changing code:
- Read `.brain/README.md` and `.brain/Agent-Protocol.md` if they exist.
- Search `.brain/` for notes related to the current task, especially prior fixes, decisions, runbooks, and known issues.
- Treat code as the source of truth. Notes explain intent, decisions, verified workflows, and previous pitfalls.

After fixing a bug or making a non-trivial project decision:
- Add or update a note in `.brain/Fixes/`, `.brain/Known-Issues/`, `.brain/Decisions/`, or `.brain/Runbooks/`.
- Include symptom, root cause, files changed, verification, and guidance for future agents when relevant.
- If a note is outdated, update it instead of silently working around it.
<!-- END:shared-brain-rules -->

---

# AGENTS.md

> Project-level instructions for AI agents working in this repository.

## Project Overview

**lockscreentodo.com** is a Next.js 14 app that generates custom lock screen wallpapers and integrates with Notion for task management. Users can sync Notion tasks to create personalized lock screen backgrounds with todo lists, motivational quotes, and weather information.

**Tech stack:** Next.js 14, TypeScript, Tailwind CSS, Radix UI, Clerk, Supabase, AI SDK, R2 storage.

**Primary goals:** Generate lock screen wallpapers, sync Notion tasks, manage user authentication and wallpaper downloads, and grow lockscreentodo.com through focused SEO, Notion ecosystem distribution, and product activation work.

## Active Business Focus

Date: 2026-07-05

The active business is **LockscreenTodo**.

Active wedge:

> Turn Notion tasks and daily priorities into a lock screen you cannot ignore.

Legacy non-lockscreen product lines are no longer active. Their lessons remain in `.brain/`, but their executable code paths should not be rebuilt unless the user makes a new explicit strategic decision.

## Repository Structure

```text
src/
  app/
    [lang]/
      page.tsx            # Homepage
      generator/          # Wallpaper generator page
      dashboard/          # User dashboard
      lockscreen-mcp/     # MCP lockscreen tool page
    api/
      auth/               # Clerk auth callbacks
      notion/             # Notion OAuth and sync
      wallpaper/          # Wallpaper save/load
      og/                 # OG image generation
    layout.tsx            # Root layout
  components/
    lockscreen/           # Lockscreen-specific components
    ui/                   # Radix-based UI primitives
  hooks/
  lib/
  types/

scripts/
  agent-gateway-demo.mjs
  gemini-spawn-harness.mjs
  desktop-scheduler.mjs
  secret-guard.mjs

.brain/
  Agent-Protocol.md
  Fixes/
  Decisions/
  Known-Issues/
  Runbooks/
  Sessions/

apps/
packages/
tooling/
vendor/
```

## Conventions

- Language: TypeScript strict mode.
- Formatter: prettier defaults, single quotes, semicolons, 120 print width.
- Linter: ESLint with Next.js recommended config.
- Import order: external -> internal -> types -> utils -> relative.
- Pages: `kebab-case/page.tsx`.
- Components: `PascalCase.tsx`.
- Hooks: `camelCase.ts` with `use` prefix.
- API routes: `kebab-case/route.ts`.
- Server utilities: `camelCase.ts`.

## Testing

```bash
npm run lint
npm run build
```

This project uses `bun` internally in some historical workspace areas, but `npm` scripts are the public interface. Do not assume bun is available.

## Tool Permissions

Allowed:
- Read and edit files under `src/`, `scripts/`, `.brain/`, `apps/`, and `packages/`.
- Run `npm run lint`, `npm run build`, and `npm run dev`.
- Run maintained agent scripts such as `npm run agent:daemon` and `npm run secrets:*`.
- Read `.brain/` files and update Fixes, Decisions, Known-Issues, and Runbooks.
- Run Supabase MCP tools for database operations.

Restricted, ask before proceeding:
- Modifying `turbo.json`, `next.config.mjs`, or deployment configuration.
- Installing production dependencies.
- Running destructive database operations.
- Mutating git history or force-pushing.

Not allowed:
- Modifying `auth.json`, credentials, or `.env` files.
- Accessing Cloudflare R2 credentials directly.

## Known Constraints

- Next.js version: 14.2.25, not 15. API differences from training data exist. Read local Next docs when available before changing routing or server component behavior.
- i18n routes live under `[lang]`. Middleware handles locale detection. Do not hardcode `/en/` or `/zh/` paths unless the existing route contract requires it.
- Clerk auth uses `@clerk/nextjs` v6. Server components use `auth()` from `@clerk/nextjs/server`; API routes use `getAuth(req)`.
- Supabase uses `@supabase/supabase-js` with service role key for server operations. Row-level security is enforced at the database level.
- R2 wallpaper public URL prefix: `https://pub-ecd6aed460e347b9bd9ec22d2a30e0fe.r2.dev/`.
- No dedicated unit/integration test suite currently exists. Use lint and build as the main verification gates.

## Verification Gates

Before marking code tasks complete:

- `npm run lint` passes or any pre-existing blocker is clearly reported.
- `npm run build` completes without errors.
- Changed files are within the permitted scope.
- Relevant `.brain` notes are written or updated for non-trivial decisions and fixes.

## Contact / Escalation

If the agent cannot proceed without a decision outside permitted scope, stop and describe the blocker clearly.

When stuck on a bug:
1. Search `.brain/Fixes/` for similar issues.
2. Search `.brain/Known-Issues/` for known limitations.
3. If neither applies, write a Fix note and mark the issue as known but unresolved.

## Coding Skills

AI agents should load `.brain/SKILLS.md` when writing, reviewing, or refactoring code.

See `.brain/Skills/` for language-specific rules and universal principles.
