# Unsplash Key Legacy Env Fallback

Date: 2026-04-26
Status: fixed

## Symptom

The scene background picker showed:

`Failed to load images. Please try again.`

This happened when selecting scenes such as `Creative Art`.

## Root Cause

`GET /api/unsplash/photos` returned:

`{"error":"Unsplash API key not configured"}`

The app is now running from the repo root, but `UNSPLASH_ACCESS_KEY` only existed in the legacy `lockscreentodo/.env.local` file. Root `.env.local` did not define it.

## Files Changed

- `src/app/api/unsplash/photos/route.ts`

## Fix

The Unsplash route now reads `process.env.UNSPLASH_ACCESS_KEY` first, then falls back to the legacy `lockscreentodo/.env.local` or `lockscreentodo/.env` server-side. No secret value is committed to source.

## Verification

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- `GET /api/unsplash/photos?query=abstract&per_page=3` returned 200 with 3 images.

## Future Guidance

Prefer moving required env vars into the active root `.env.local` for deployment parity. Keep the fallback only as a local migration bridge while the repo still contains the legacy `lockscreentodo` app directory.
