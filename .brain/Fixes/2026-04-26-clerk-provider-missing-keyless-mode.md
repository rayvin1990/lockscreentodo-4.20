# Clerk Provider Missing in Keyless Mode

Date: 2026-04-26
Status: fixed

## Symptom

`/en/generator` crashed in the browser with:

`@clerk/nextjs: useAuth can only be used within the <ClerkProvider /> component`

The stack pointed at `src/app/[lang]/generator/page.tsx`, where `useAuth()` is called.

## Root Cause

`src/app/layout.tsx` skipped rendering `<ClerkProvider>` when `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` was missing. Several client pages and hooks call Clerk hooks unconditionally, so removing the provider made those hooks throw.

The first attempted fix used the installed Clerk Next SDK keyless/dev provider. That avoided the missing provider error, but triggered a client runtime error in this repo's Next/React combination:

`Client Functions cannot be passed directly to Server Functions`

The keyless wrapper passes component props, including `children`, into a server action during client hydration. This can serialize client functions across the server action boundary and fail.

A second attempted local fallback avoided keyless, but left `useAuth().isLoaded` stuck in a loading state. That blocked the generator with `Authentication is still loading` when clicking generate wallpaper.

## Files Changed

- `src/app/layout.tsx`
- `src/components/clerk-local-fallback-provider.tsx`
- `src/lib/server-env.ts`
- `src/lib/clerk/server-auth.ts`

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- `GET http://localhost:3000/en/generator` returned 200.
- Restarted the dev server on port 3000 after wiring the legacy Clerk env fallback.

## Future Guidance

Do not skip Clerk context when local Clerk keys are missing.

Also avoid the current Clerk Next keyless provider path in this repo until the SDK/Next version pair is verified. Prefer reading the legacy `lockscreentodo/.env.local` keys through `src/lib/server-env.ts` while the app is still running from the repo root.
