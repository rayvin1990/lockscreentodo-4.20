# Agent-Curated Lockscreen Reminders

Date: 2026-04-25
Status: active

## Context

Lockscreen Todo currently works as a human-facing todo wallpaper generator: users manually enter tasks, choose a background, generate a wallpaper, and set it as their phone lock screen.

The product direction is being revisited in light of AI agents. Human-facing workflow software is increasingly vulnerable when agents can assemble and operate workflows directly. The stronger opportunity is to provide capabilities that agents can call.

## Decision

Keep the existing lockscreen todo product available for now, but shift the main product direction toward agent-curated real-world reminders.

The product should not focus on showing what an agent is doing. Agent execution status is usually noise for the lock screen.

The stronger use case is: an agent discovers or selects tasks that must still be completed by a human in the physical world, then pushes the most important reminders to the phone lock screen.

## Product Thesis

AI can identify, prioritize, and prepare tasks, but some tasks still require the user's body, presence, judgment, or location.

Lockscreen Todo should become the lock screen reminder layer for those human-only tasks.

Examples:

- Take medication
- Buy groceries
- Go to a place to handle an errand
- Bring documents
- Pick up packages
- Attend appointments
- Call or visit family

## Positioning

Old positioning:

- A to-do list wallpaper generator for people.

New direction:

- AI discovers tasks, lock screen reminds you to personally complete them.
- Agent-curated real-world reminders on your lock screen.
- A lockscreen output primitive for human tasks discovered by AI.

## Design Guidance

Preserve the current generator as a working surface while exploring the new direction.

Prioritize future work that makes the product callable by agents or automations:

- Structured task ingestion
- Webhooks or API endpoints for pushing reminders
- Templates optimized for 1-5 high-priority human tasks
- Rules for deciding what deserves lockscreen visibility
- Integrations with calendars, notes, chat, Notion, email, and agent workflows

Avoid over-investing in purely cosmetic wallpaper features unless they support the new reminder workflow.

## Future Verification

Useful validation signals:

- Users connect an external source instead of manually typing tasks
- Agents or automations create lockscreen reminders repeatedly
- Generated reminders are about real-world actions, not generic task lists
- Users return because the lock screen helped them complete something they would otherwise miss

