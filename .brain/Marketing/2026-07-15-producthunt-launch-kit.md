# Product Hunt launch kit

> Pre-launch template. Aim to launch on a Tuesday or Wednesday morning (US Pacific), so the day-long ranking window catches the most traffic.

---

## Tagline (60 chars max)

> "Your Notion tasks on your phone lock screen."

## One-liner (160 chars max)

> Lockscreen Todo turns your Notion to-do list into a lock screen wallpaper. Read-only OAuth, no app install, free preview. Today's tasks in your face 50+ times a day.

## Long description (markdown)

### Problem
You keep your life in Notion, but the only time you actually *see* your Notion is when you remember to open the app. Most people don't. The phone's lock screen is visible 50-150 times a day. The task app is opened 4-10 times. The lock screen wins attention. Use it.

### Solution
Lockscreen Todo pulls your tasks from a Notion database and renders them as a phone lock screen wallpaper. Read-only OAuth. No app install. Free preview. Your tasks, where you already look.

### How it works
1. Connect Notion (OAuth, read-only).
2. Pick the database that holds your daily tasks.
3. The app imports tasks due today (or tomorrow as fallback) and renders them onto a wallpaper.
4. Save the JPG to your phone, set it as your lock screen.

### Why now
- Notion has 30M+ users, many of whom treat it as their primary task manager.
- The iOS Lock Screen API (iOS 16+) made wallpaper-based reminders a first-class citizen.
- Existing lock-screen note apps are walled gardens — they want you to re-enter your tasks inside them, instead of pulling from your source of truth.

### Who it's for
Notion power users. People with ADHD who forget tasks. Caregivers for elderly patients (medication schedules). Students. Anyone who treats Notion as a daily agenda.

### What we don't do
- No mobile app.
- No analytics beyond Vercel Web Analytics.
- No storage of your task content.
- No AI training on your tasks.

---

## Maker comment (post on launch day, first 30 min)

> Hey Product Hunt! I'm Ray, the solo maker of Lockscreen Todo.
>
> I built this because I kept forgetting what I had to do. Apple's Reminders widget is small and disconnected from Notion. The existing commercial lock-screen note apps want you to re-enter your tasks inside them, which meant my real source of truth (Notion) was out of sync with the wallpaper I was staring at all day.
>
> Lockscreen Todo reads from your Notion via OAuth (read-only) and bakes the tasks onto a JPG you save to your phone. No app install. No analytics beyond Vercel. No data stored on our servers.
>
> I would love your feedback — especially on:
> - What other Notion workflows you wish it supported (status-based filtering, multiple databases, etc.)
> - Whether the wallpaper is the right canvas, or whether we should explore widgets
> - How the date filter should work (today vs tomorrow vs the whole week)
>
> AMA in the comments!

---

## First-day response template (negative feedback)

> Thanks for the honest feedback. The reason I didn't build X is [reason]. If you think X should be on the roadmap, can you say more about how you'd use it? I want to make sure I understand the use case before I commit to building it.

## First-day response template (positive feedback)

> Thank you! That use case (X) is exactly what I was hoping for. Mind if I DM you when I have a beta to try?

---

## Asset checklist (pre-launch)

- [ ] Tagline (60 chars)
- [ ] One-liner (160 chars)
- [ ] Long description (markdown above)
- [ ] Hero image (1200x630, already done via /api/og)
- [ ] 3 product screenshots (use generator, connect Notion, save JPG)
- [ ] Maker profile photo
- [ ] GitHub / Notion / Twitter links
- [ ] 5 launch supporters confirmed (they post "I'll be there" comments)
- [ ] 1 blog post for "first review" (link to /en/press)

---

## Launch-day schedule (PT)

- 00:01 — Submit to PH (12:01am PT Tuesday is the standard slot)
- 00:15 — Maker comment posted
- 06:00 — Tweet launch
- 08:00 — Reddit r/Notion + r/productivity posts (different copy)
- 12:00 — Hacker News "Show HN" post
- 18:00 — End-of-day summary tweet

---

## Pricing (current)

- Free: 1 wallpaper per day, with watermark
- Pro: unlimited wallpapers, no watermark, $X/month or $Y/year (decide before launch)
