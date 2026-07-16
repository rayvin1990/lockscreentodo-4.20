# Lesson — research before implementing filter UX

**Date:** 2026-07-16

**Mistake:** After fixing the Notion OAuth + auto-import + scoring bugs, the agent jumped straight to "smart date filter" implementation. Built five filter buttons (All / Today / Tomorrow / This Week / No date) without asking what unit Notion power users actually plan around.

The user pushed back: "look up how most people use Notion todo, do they plan by calendar?" That triggered a HN-based deep research, which found:

- "Tomorrow" is **not a natural unit** in Notion workflows. No HN user described planning by tomorrow. They plan by **today** (agenda for today), **this week**, or **this sprint**.
- Dominant pattern: single task DB + multiple views (Board/Calendar/Table), filtered by `Due` date. This is GTD-flavoured.
- Lockscreentodo's wallpaper IS the daily agenda — the product is already in the "agenda" mental model, so the scope should match: **today + overdue**, not **tomorrow**.
- We were solving "prevent old sample tasks from leaking" with a tomorrow filter. That is a **leak-prevention** problem, not a **product-design** problem. The two got conflated.

**Lesson:** When implementing any user-facing default (filter, sort, default value, scope), do **one** of the following before coding:

1. Quick HN / Reddit / blog search on how existing users describe the unit they use ("do you plan by today? tomorrow? this week?").
2. Or push back to the user with the question explicitly: "in your own Notion use, do you set due-dates for tomorrow, or do you just pick today's tasks when you wake up?"

A 5-minute research round is cheaper than a 30-minute implementation that gets reverted. Especially for solo-builder products where the founder is the only user — we have a built-in primary-source to consult.

**Action:** Add `agent-research-before-defaults.md` checklist to the operator workflow.

**Related files:**
- `.brain/Research/notion-task-organization.md` — the deep research output
- `src/app/[lang]/generator/page.tsx` — the filter implementation, now `today + overdue` with `tomorrow` as fallback