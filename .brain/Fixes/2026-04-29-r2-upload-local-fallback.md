# R2 Upload Local Fallback

Date: 2026-04-29
Status: fixed

## Symptom

The generator showed `Generation failed` with `Failed to upload to R2 (Status: 500)` when creating a wallpaper.

## Root Cause

The active local environment did not define `R2_ACCOUNT_ID`, `R2_API_TOKEN`, or `R2_BUCKET_NAME`. `/api/upload/r2` returned a storage configuration error, and the generator treated that as a hard failure even though the wallpaper image had already been rendered locally.

## Files Changed

- `src/app/[lang]/generator/page.tsx`
- `src/app/api/upload/r2/route.ts`

## Fix

R2 upload failure now degrades to local download mode. If a remote R2 URL is available, the success dialog still shows the QR/share flow and saves wallpaper history. If storage is unavailable, generation still succeeds, the QR/share URL is omitted, and the user can download the rendered wallpaper directly.

The R2 route now reports missing storage configuration as `503` instead of a generic `500`.

## Verification

- `npx tsc --noEmit` passed.

## Future Guidance

Do not make remote storage a hard dependency for local wallpaper generation. Keep R2 required only for QR sharing, public links, and history records that need a stable remote image URL.
