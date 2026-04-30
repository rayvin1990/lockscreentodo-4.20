# LockscreenTodo Agent Pivot Discussion

Date: 2026-04-25
Status: active

## Context

We discussed whether LockscreenTodo is still a good product direction in the AI agent era.

The trigger was Liu Xiaopai's argument that AI does not eliminate software, but it does devalue solution-style software. Primitive-style software becomes more valuable because agents and systems need stable capabilities to call.

## Key Insight

Human-facing workflow software is risky when users increasingly ask agents to operate workflows for them.

The opportunity is not to build another app people must open. The opportunity is to build a primitive that agents can call.

For LockscreenTodo, this means:

- The old product can remain as a manual todo wallpaper generator.
- The main direction should shift toward an agent-callable lockscreen reminder layer.
- The lock screen should not show what the agent is doing.
- The lock screen should show tasks that still require the human to personally act in the physical world.

## Product Reframe

Old framing:

- A to-do list wallpaper generator for people.
- User opens the web app, enters tasks, chooses a background, downloads a wallpaper, and sets it manually.

New framing:

- AI discovers tasks, lock screen reminds the user to personally complete them.
- Agent-curated real-world reminders on the phone lock screen.
- Agent-to-lockscreen delivery layer for human-only tasks.

The stronger product question:

What must the user still do with their body, presence, location, or judgment after the agent has done everything it can?

## Strong Use Cases

- Take medication
- Buy groceries
- Go to a place to handle an errand
- Bring documents
- Pick up packages
- Attend appointments
- Call or visit family
- Handle offline payments, renewals, or administrative tasks

## Important Boundary

Do not push generic agent status to the lock screen.

Agent status is usually noise. Examples like "agent is working", "gateway restarted", or "task completed" should not consume lock screen space unless they imply a real-world human action.

The lock screen should be reserved for reminders that are:

- human-only
- time-sensitive
- location-sensitive
- easy to miss
- costly if missed

## OpenClaw Relationship

OpenClaw already has reminder and notification capability, but it does not reach the phone lock screen.

The natural split:

- OpenClaw is the upstream brain: detects, classifies, and triggers reminders.
- LockscreenTodo is the phone delivery layer: renders the small active queue of real-world tasks for the lock screen.

This creates a concrete first integration:

OpenClaw Reminder -> LockscreenTodo API/MCP -> lockscreen queue -> future mobile app.

## QR Code Is Transitional

The current QR/download/manual wallpaper setup is acceptable for early validation, but it is not the final product.

The long-term product should be a mobile companion app that receives reminders from OpenClaw or other agents, renders the lockscreen surface, and updates the lock screen with minimal user action.

Platform view:

- Android is the better first platform for automatic lock screen wallpaper updates.
- iOS should use widgets, Live Activities, Shortcuts, or confirmation-based flows unless automatic wallpaper replacement is verified.

## Implementation Started

We started turning the product into an agent-callable capability.

Files added:

- `docs/PRD-Agent-Lockscreen-Reminder-Layer.md`
- `src/lib/agent-reminders.ts`
- `src/app/api/agent/reminders/route.ts`
- `src/app/api/mcp/route.ts`
- `.brain/Specs/2026-04-25-agent-to-lockscreen-reminder-layer.md`
- `.brain/Decisions/2026-04-25-agent-curated-lockscreen-reminders.md`

Current prototype behavior:

- `POST /api/agent/reminders` accepts structured reminder events.
- `GET /api/agent/reminders` returns stored reminders and the active `lockscreenQueue`.
- `POST /api/mcp` exposes MCP-style tools:
  - `push_lockscreen_reminders`
  - `get_lockscreen_queue`
- Storage is currently in-memory only.
- Development mode is open. Production requires `AGENT_API_KEY` or `LOCKSCREEN_AGENT_API_KEY`.

## Verification

Verified:

- `npx tsc --noEmit` passed.
- `npm run secrets:all` passed.
- Next dev server started at `http://localhost:3000`.
- REST reminder API accepted OpenClaw-style reminder payloads.
- MCP `tools/list` and `tools/call push_lockscreen_reminders` worked.

Known limitations:

- `npm run lint` fails because existing `eslint.config.mjs` imports an ESLint package subpath that is not exported.
- `npm run build` hung and was interrupted.
- `Invoke-WebRequest` and PowerShell display had encoding/output quirks, but `Invoke-RestMethod` and server logs confirmed 200 responses.
- The prototype does not yet persist data or update a real phone lock screen.

## Product Decision Framework

Two dimensions for evaluating any product idea:

### 1. For Human Users

| Type | Verdict | Reason |
|------|---------|--------|
| Process/workflow tools | ❌ Not worth building | AI can replicate with 1-2 prompts; no moat for indie devs |

**Key insight**: If it's purely functional and process-oriented for humans, don't bother. If it can bring genuine emotional value or guidance, there's opportunity.

**Why workflows have no moat**: AI can generate a complete workflow app in minutes with natural language. What used to take 3 months of dev work now takes 10 minutes with Cursor + Claude Code. The "technical barrier" that once protected indie developers is gone.
| Emotional value /情感引导 | ✅ Worth pursuing | AI cannot replace genuine emotional connection |

**Key insight**: If it's purely functional and process-oriented for humans, don't bother. If it can bring genuine emotional value or guidance, there's opportunity.

### 2. For Agent Users

| Type | Verdict | Reason |
|------|---------|--------|
| Rigid need + high frequency | ✅ Worth building | Stable demand, defensible |
| Low moat / easy to replicate | ❌ Not worth building | Will be commoditized immediately |

**Key insight**: Build primitives that agents call repeatedly. Moat comes from deep integration, reliability, and specific surface access (e.g., lock screen).

### Applying the Framework to LockscreenTodo

Current pivot:

- **Who uses it**: Agent (OpenClaw) → Human (lock screen)
- **Agent side**: Rigid need (reminders must reach human), high frequency (daily tasks)
- **Moat**: Lock screen rendering on mobile is non-trivial across Android OEMs; iOS is restricted
- **Human side**: Not emotional value — this is about not missing critical real-world tasks

### Questions for Future Products

1. Who is the end user — human or agent?
2. If human: does it provide emotional value? If no → discard
3. If agent: is it rigid need + high frequency + defensible moat? Any no → discard

## 2026-04-26 Conversation Summary

Today's discussion (2026-04-26) continued the product pivot thinking and formalized the decision framework.

### 刘小排文章核心观点
- AI 蒸发的是 Solution 形态的软件，不是软件本身
- Primitive（底层能力组件）反而升值，因为 Agent 越多，底层调用量越大
- 未来软件最大的客户不是人，是 Agent

### Products are either for humans or for agents

**Human-facing products:**
- Workflow/process tools: ❌ Not worth building — AI replicates with 1-2 prompts in minutes
- Emotional value / 情感引导: ✅ Worth pursuing — AI cannot replace genuine human emotion

**Agent-callable products:**
- Rigid need + high frequency + defensible moat: ✅ Worth building
- Low moat: ❌ Not worth building

### Why workflow tools have no moat
- Technical barrier is gone. What took indie devs 3 months now takes 10 minutes with Cursor + Claude Code
- AI can generate a complete workflow app from a single prompt
- Therefore: independent developers cannot compete on workflow products

### Applying to LockscreenTodo
- LockscreenTodo pivot = Agent → Human delivery layer
- Agent side:刚需 (reminders must reach human), 高频 (daily tasks)
- Moat: lock screen rendering is non-trivial across Android OEMs; iOS restricted
- This is NOT emotional value — it's about not missing critical real-world tasks

### Three Questions for Any Future Product
1. Who is the end user — human or agent?
2. If human: does it provide emotional value? If no → discard
3. If agent: is it rigid need + high frequency + defensible moat? Any no → discard

---

## Product Principle

Do not compete with agents by building another workflow app.

Serve agents by giving them a reliable way to deliver human-only real-world tasks to the user's most persistent attention surface: the phone lock screen.

