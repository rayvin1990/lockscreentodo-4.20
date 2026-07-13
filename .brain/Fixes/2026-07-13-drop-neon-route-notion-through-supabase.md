# Drop Neon, route Notion through Supabase

**Date:** 2026-07-13
**Symptom:** After connecting Notion, the generator showed no imported tasks even though the OAuth round-trip succeeded. Several hours of debugging revealed the codebase was reading and writing two different Postgres instances for what should have been a single flow.

**Root cause:** Two databases, one of them hidden behind a misleading filename.

- `src/lib/supabase/server.ts` exported `createServerSupabaseClient()` that **returned a Neon client** (`@neondatabase/serverless`'s `neon()` driver, configured from `NEXT_PUBLIC_NEON_DATABASE_URL`). The name said Supabase; the implementation was Neon.
- `src/lib/supabase/admin.ts` exported the real Supabase client (`@supabase/supabase-js` with service-role key). The name here was honest.
- The four Notion API routes imported the wrong one: `auth/callback`, `tasks`, `sync`, and `user/notion-status`. They wrote Notion OAuth tokens into the Neon `User` table and Notion tasks into the Neon `tasks` table — neither of which the rest of the app touched.
- The browser `supabase` client (created in `src/app/[lang]/generator/page.tsx`) hit the real Supabase REST API and expected to find its data there. It found an empty table because sync wrote to Neon.
- The same `tasks` table's RLS policy required an `x-clerk-user-id` HTTP header that no code path actually injected. Browser-side `PATCH` (soft delete) returned 204 No Content even when zero rows matched, making it look like everything worked when in fact nothing did.

**Fix:** Cut Neon out of the picture.

**Files deleted:**

- `src/lib/supabase/server.ts` (misleading wrapper around Neon)
- `src/lib/neon/server.ts` (the other Neon wrapper)

**Files rewritten to use the real Supabase client (`src/lib/supabase/admin.ts`):**

- `src/app/api/notion/auth/callback/route.ts` — uses `supabase.from('User').upsert(...)` to save Notion OAuth tokens.
- `src/app/api/notion/tasks/route.ts` — uses `supabase.from('User').select(...)` for token lookup.
- `src/app/api/notion/sync/route.ts` — uses `supabase.from('tasks').select/upsert/update(...)` for the sync diff. Soft-delete stays scoped to the active source via `notion_database_id` filter.
- `src/app/api/user/notion-status/route.ts` — same swap.

**Dependency removed:** `@neondatabase/serverless` from `package.json`.

**Verification:** `npm run lint` and `npm run build` both pass. Manual end-to-end Notion connect + import still pending user testing on the live deployment.

**Vercel environment variables to clean up** (do this from the Vercel dashboard, not from code):

- `NEXT_PUBLIC_NEON_DATABASE_URL`
- `DATABASE_URL`
- `POSTGRES_URL`

These can stay around harmlessly until the next deploy proves nothing references them. Removing them tightens the security surface and avoids confusion if a future agent searches for "which database does this project use."

**Why we kept the `notion_database_id` column for page sources:**

Pages don't have a database id. Rather than add a `notion_source_id` column and migrate, we overload `notion_database_id` to also hold the Notion page id when the source is a page. The `sync` route's soft-delete filter (`existing.notion_database_id !== source.id`) treats it uniformly. If a future migration is feasible, rename the column to `notion_source_id` and add `notion_source_type`.

**RLS still needs work, but it is out of scope for this commit:**

The `tasks` RLS policy that demands `x-clerk-user-id` in the request header is the reason browser-side `supabase.from('tasks').upsert(...)` returns 401. After this commit, server-side writes via the service-role client bypass RLS, so the Notion flow works. The browser-side direct read/write path (used by `src/app/[lang]/generator/page.tsx`'s `saveTasksToSupabase`) still fails silently. Fixing that requires either configuring Clerk's Supabase JWT template so `auth.uid()` reflects the Clerk user id, or rewriting the browser flow to call our own API routes instead of going to Supabase REST directly. Future agent: pick one and document.