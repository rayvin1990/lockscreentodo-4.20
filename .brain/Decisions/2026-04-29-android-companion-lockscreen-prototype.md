# Android Companion Lockscreen Prototype

Date: 2026-04-29
Status: Prototype scaffolded

## Context

The user wants to personally experience the full Lockscreen MCP loop: an agent or automation pushes a real-world reminder, then the phone lock screen changes automatically enough to make the reminder unavoidable.

## Decision

Build the first mobile prototype as a native Android app, not iOS and not web/PWA.

Android can use `WallpaperManager.setBitmap(..., FLAG_LOCK)` to set a generated image as the lock screen wallpaper. iOS does not allow a normal website or app to silently replace the lock screen wallpaper, so Android is the only practical path for the first real experience.

## Prototype Scope

The scaffolded app lives in `android-lockscreen-companion/`.

It:

- Lets the user enter a Lockscreen Todo server URL.
- Lets the user enter an optional agent API key.
- Fetches `GET /api/agent/reminders`.
- Reads `lockscreenQueue`.
- Renders a local 1080 x 2400 bitmap.
- Sets that bitmap as the Android lock screen wallpaper.
- Can push one test reminder through `POST /api/agent/reminders`.

## Current Limitations

- The local machine currently has Java but no Android SDK, Gradle, adb, or Android Studio CLI, so the APK was not built in this session.
- The existing reminder backend is prototype-grade and in-memory. Local dev is fine for the first loop; production/serverless persistence needs a database before this becomes reliable.
- Phone access to local dev requires a LAN IP, Tailscale URL, or deployed production URL. `localhost` on Android means the phone, not the PC.

## Future Guidance

Open `android-lockscreen-companion/` in Android Studio, let it install SDK/Gradle, then run on a USB-debugging Android phone. Use the PC LAN IP or Tailscale hostname as the server URL.
