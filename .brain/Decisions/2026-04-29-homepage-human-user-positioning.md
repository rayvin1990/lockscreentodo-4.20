# Homepage Human-User Positioning

Date: 2026-04-29
Status: Implemented

## Context

We tested the Lockscreen MCP path and found the agent-to-phone story still depends on a separate delivery layer. If the reminder has to go through Feishu or another notification channel first, the lock screen wallpaper value becomes less direct. Elderly-care positioning is also weak as a primary market because older users are unlikely to configure the tool themselves, and family setup is lower frequency.

## Decision

Reposition the public homepage around a human-facing generator:

> AI lock screen task wallpaper generator

The primary flow is:

1. Write tasks, habits, reminders, or countdowns.
2. Generate a clean HD lock screen wallpaper.
3. Scan the QR code on a phone.
4. Save and set it as the lock screen.

MCP and agent integrations remain available as developer-facing material, but they should not drive the homepage headline or primary navigation.

## Affected Files

- `src/app/[lang]/page.tsx`
- `src/config/site.ts`
- `src/app/layout.tsx`

## Guidance

Prioritize SEO and copy around students, exam countdowns, daily tasks, habit tracking, ADHD reminders, and medication notes. Keep elderly-care and agent-to-lockscreen content as secondary/long-tail material unless a stronger delivery mechanism exists.
