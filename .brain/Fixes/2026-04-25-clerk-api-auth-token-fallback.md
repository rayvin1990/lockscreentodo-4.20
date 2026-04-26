# 2026-04-25 Clerk API auth token fallback

Status: fixed in source

## Symptom

On the generator page, Clerk UI showed the user as signed in, but clicking Generate Wallpaper returned the destructive toast "Please sign in first". The failing path was `/api/generate/check-limit` returning `reason: "NOT_AUTHENTICATED"` because server-side `auth()` had no `userId`.

## Root Cause

The client-side Clerk state and server route auth can diverge in production when same-origin cookies are not recognized by the route handler/middleware chain, or when deployment root/environment variables are misaligned. In this workspace, root `.env*` files do not contain Clerk keys while `lockscreentodo/.env*` does, and the `lockscreentodo` directory currently contains build output but not source files.

## Files Changed

- `src/app/[lang]/generator/page.tsx`
- `src/hooks/use-download-limit.ts`
- `src/components/lockscreen/user-status-badge.tsx`

## Fix

Authenticated client API calls now explicitly include `credentials: "include"` and a Clerk session token from `getToken()` in the `Authorization` header. The generator page also waits for Clerk to finish loading before deciding the user is signed out, and no longer calls `useAuth()` inside an event handler.

Follow-up: the generate button itself now checks `await getToken()` instead of trusting `isSignedIn`. This covers the case where Clerk UI renders the signed-in avatar while the `isSignedIn` boolean is stale or temporarily false.

Follow-up 2026-04-25: the API side now also has a shared `getAuthenticatedUserId(req)` helper. It first uses Clerk `auth()`, then falls back to verifying the explicit `Authorization: Bearer <session token>` with Clerk `verifyToken()` and reading the token `sub`. This prevents `/api/generate/check-limit` and related authenticated API routes from treating a signed-in browser as a guest when middleware/cookie auth state is unavailable but the client session token is valid.

Additional affected files:
- `src/lib/clerk/server-auth.ts`
- `src/app/api/generate/check-limit/route.ts`
- `src/app/api/generate/record-usage/route.ts`
- `src/app/api/wallpaper/save/route.ts`
- `src/app/api/download/check-limit/route.ts`
- `src/app/api/download/record-usage/route.ts`
- `src/app/api/user/notion-status/route.ts`
- `src/app/api/user/dashboard/route.ts`
- `src/app/api/notion/tasks/route.ts`
- `src/app/api/notion/sync/route.ts`

## Verification

- `npm run lint` could not run because the repo uses `eslint/config`, which is not exported by installed `eslint@8.57.1`.
- `npx tsc --noEmit` reached unrelated existing errors in `vibe-runner/vibe_bot_ws.ts`.
- 2026-04-25 follow-up: `npx tsc --noEmit --pretty false` passed after adding the server-side bearer-token fallback.

## Future Guidance

If this symptom recurs after deploy, verify the actual Vercel project root and environment variables. The app that builds the `src/` code must have matching Clerk publishable and secret keys from the same live/test Clerk instance.
