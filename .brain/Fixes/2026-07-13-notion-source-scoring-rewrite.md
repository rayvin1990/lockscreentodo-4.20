# Notion import rewrite: support databases + pages with smart scoring

**Date:** 2026-07-13
**Symptom:** Users reported that connecting Notion either imported nothing or imported the wrong content. The previous code only supported Notion databases, picked the most-recently-edited one regardless of content, and silently dropped users whose todo lives in a regular Notion page (with to-do checkbox blocks).

**Root cause (compounding bugs):**

1. `/api/notion/tasks` (and the identical bug in `/api/notion/sync`) called `POST /v1/search` with `filter: { value: "database" }`. This filtered out every page that wasn't a database — the most common form of personal todo list.
2. The result was sorted by `last_edited_time` descending and the **first** item was always picked. If the user recently edited anything else (a wiki page, a daily note), that source would be used.
3. The sync route's soft-delete pass would then mark all previously-imported tasks as `deleted_at = NOW()`, even if the new source was a completely unrelated database the user never intended.

**Fix:** Replaced both routes' source-discovery logic with a scoring-based picker that supports both database and page sources.

**New files:**

- `src/lib/notion/scoring.ts` — Pure scoring function `scoreSource(source, samples)`. No IO, unit-testable.
- `src/lib/notion/sources.ts` — `discoverBestSource(token)` and `fetchTasksFromSource(token, source)`. Handles search, sampling, pagination, database rows vs page blocks (to_do blocks).

**Modified files:**

- `src/app/api/notion/tasks/route.ts` — replaced search + pick-first-database with `discoverBestSource` (or explicit query param). Response adds `sourceType` and `sourceId` fields; `databaseName` preserved for backward compatibility.
- `src/app/api/notion/sync/route.ts` — same swap. Critical safety change: the soft-delete query now selects `notion_database_id` and filters out tasks whose stored source id does not match the current source id. Switching sources no longer wipes the previous source's tasks.

**Scoring rules** (`src/lib/notion/scoring.ts`):

| Signal | Points |
|---|---|
| Each `to_do` block in sample | +2 |
| Each row / block in sample (capped at 10) | +0.5 each |
| Title matches `/todo\|task\|to-do\|待办/i` | +3 |
| Title matches `/list\|checklist/i` | +1 |
| Title matches `/wiki\|note\|journal\|log/i` | -2 |
| Zero to-dos, zero checkable, fewer than 3 rows | -10 (hard exclude) |

**Discoverer behavior** (`src/lib/notion/sources.ts`):

- Calls `/v1/search` with **no filter**, sorted by `last_edited_time` desc.
- Takes top 5 candidates.
- For each candidate, samples up to 5 rows (database) or 10 blocks (page) and scores them.
- Early termination: 2 consecutive zero/low scores in a row → stop iterating.
- Returns the highest scorer if its score ≥ 1; otherwise null (caller returns 404).

**Explicit selection:**

- `/api/notion/tasks?databaseId=xxx` → forces database source, skips scoring.
- `/api/notion/tasks?pageId=xxx` → forces page source, skips scoring.
- Same params work on `/api/notion/sync`.

**Verification:**

- `npm run lint` passes.
- `npm run build` passes.
- Manual verification requires Notion env in `.env.local` and a workspace containing at least one shared database or page. Without env, both endpoints return 500 / 401 cleanly.

**Things future agents should NOT change without thinking:**

- The `MIN_ACCEPTABLE_SCORE = 1` threshold. Lowering it admits journals, logs, etc.
- The soft-delete filter `existing.notion_database_id !== source.id` in `sync/route.ts`. Removing it re-introduces the cross-source wipe.
- The `notion_database_id` column name. It's overloaded to also store page ids because adding a new column would require a migration. If a migration is ever feasible, rename to `notion_source_id` and add a `notion_source_type` column.
- The "no recursion into sub-pages" choice in `fetchPageBlocks`. Recursing would blow up API calls and likely hit rate limits on personal workspaces.

**Open considerations:**

- No unit tests for `scoring.ts` because the project has no test infrastructure. If that ever changes, `scoring.ts` was designed for it.
- `discoverBestSource` is sequential (one candidate at a time). Could be parallelized up to concurrency 2 if latency becomes an issue, but Notion's 3 req/s rate limit means this is rarely worth it.
- The UI does not currently display the chosen source. If users complain about wrong-source selection, expose `sourceType` / `sourceId` in the response and surface them in `notion-task-selector.tsx`.