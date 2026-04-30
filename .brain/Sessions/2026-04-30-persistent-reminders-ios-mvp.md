# Session Summary: 2026-04-30 - Persistent Agent Reminders & iOS MVP

## Status
- [x] Refactor Agent Reminders from in-memory to Supabase.
- [x] Deliver iOS Shortcut PNG endpoint.
- [x] Verify SEO Scenario Pages.

## Changes

### 1. Persistence Layer (`agent-db.ts` & `agent-reminders.ts`)
- **Root Cause**: In-memory storage (`globalStore`) was lost on server restarts (Vercel serverless), making the "Agent Era Primitive" unreliable.
- **Implementation**:
    - Unified `reminders` table name across code and migrations.
    - Updated `src/lib/agent-reminders.ts` to be fully `async` and use `src/lib/agent-db.ts`.
    - Added `mapDbReminder` to handle camelCase/snake_case mapping.
    - Updated `src/app/api/mcp/route.ts` and `src/app/api/agent/reminders/route.ts` to support the new async library.
- **Files Affected**:
    - `src/lib/agent-db.ts`
    - `src/lib/agent-reminders.ts`
    - `src/app/api/mcp/route.ts`
    - `src/app/api/agent/reminders/route.ts`
    - `supabase/migrations/00000000000000_create_lockscreen_tables.sql`

### 2. iOS Shortcut MVP (`/api/lockscreen/shortcut`)
- **Context**: iOS cannot silently update wallpapers via browser.
- **Solution**: A dedicated endpoint for iOS Shortcuts.
- **Flow**:
    1. iOS Shortcut calls `GET /api/lockscreen/shortcut?key=API_KEY`.
    2. Endpoint fetches user's queue from DB.
    3. Endpoint proxies to `api/og/lockscreen` to render PNG.
    4. Endpoint returns raw PNG stream.
- **Verification**: `curl -v "http://localhost:3000/api/lockscreen/shortcut?key=..."` returns `image/png`.

### 3. SEO Scenario Pages
- Verified `src/app/[lang]/[scenario]` and `src/lib/seo-scenarios.ts`.
- These pages are live and correctly map templates (ADHD, Ops Alert, etc.) to the visual generator.

## Next Steps
- [ ] Implement Push Notifications (Bark/Pushcut) to trigger Shortcut updates.
- [ ] Build a "Share to Shortcut" UI in the dashboard to help users install the Shortcut.
- [ ] Android Companion App: Update to use the new Supabase-backed endpoints.
