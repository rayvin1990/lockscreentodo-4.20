# Notion tasks imported but UI shows nothing

**Date:** 2026-07-13
**Symptom:** After clicking "Connect Notion" the user lands back on `/en/generator?notion=connected`, the OAuth round-trip succeeds, but the Tasks panel in the wallpaper editor remains empty even though Notion clearly has a todo list. No error toast, just nothing.

**Root cause:** Data lives in two different Postgres instances, and the read path used by the editor never sees the data the sync path wrote.

| Step | Code | DB written to |
|---|---|---|
| OAuth callback stores `notionAccessToken` | `src/app/api/notion/auth/callback/route.ts:90-101` | Neon (`User` table) |
| Sync pulls pages and upserts tasks | `src/app/api/notion/sync/route.ts:240-271` | Neon (`tasks` table) |
| `/api/notion/tasks` returns Notion tasks on demand | `src/app/api/notion/tasks/route.ts:131-200` | Reads Neon |
| `useNotionSync` populates React state | `src/hooks/use-notion-sync.ts:79-89` | In-memory only |
| **Editor "load tasks" on page mount** | `src/app/[lang]/generator/page.tsx` (old `loadTasksFromSupabase`) | **Reads from Supabase REST** |

Supabase and Neon are separate projects (project ref `hhzrbaejfznxukkctotd` for Supabase, separate Neon URL). The Notion sync path writes to Neon, but the editor's "restore my last wallpaper tasks" hook was reading from Supabase's `tasks` table, which is never populated by the Notion import. Result: Notion import succeeds silently, the editor still loads an empty list from Supabase, and the user sees nothing.

The misleading `createServerSupabaseClient` name made this worse: `src/lib/supabase/server.ts:36` returns the Neon client, while `src/lib/supabase/admin.ts:28` returns the real Supabase client. Notion-related routes import the former, the editor's task-loading code uses the latter.

**Fix:** Replaced the editor's `loadTasksFromSupabase` (which called `supabase.from('tasks')`) with `loadTasksFromServer`, which calls `fetchWithClerkAuth('/api/notion/tasks')`. That route already reads from Neon where the sync writes, so the editor and the sync now share a single source of truth. User-edited wallpaper tasks still flow through `saveTasksToSupabase` for local persistence, which is unchanged.

**Files changed:**
- `src/app/[lang]/generator/page.tsx:844-895` — renamed function, swapped Supabase REST read for `/api/notion/tasks` call.

**Verification:**
- `npm run lint` passes.
- After deployment: click "Connect Notion" → OAuth → editor should populate the Tasks panel within ~500 ms (the same path the auto-import on OAuth callback uses).

**Lesson for future agents:**
- When this repo says "Supabase" in code, check whether it's the real Supabase REST (`@supabase/supabase-js`) or the Neon client hidden behind the misleading `createServerSupabaseClient` name.
- Notion sync writes to Neon, not Supabase. Any UI code that needs Notion tasks should read from the API routes (`/api/notion/tasks`, `/api/notion/sync`), never from `supabase.from('tasks')`.