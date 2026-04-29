<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:shared-brain-rules -->
# Shared Obsidian Brain Protocol

This repo uses `.brain/` as a shared Obsidian vault for agents and humans.

Before changing code:
- Read `.brain/README.md` and `.brain/Agent-Protocol.md` if they exist.
- Search `.brain/` for notes related to the current task, especially prior fixes, decisions, runbooks, and known issues.
- Treat code as the source of truth. Notes explain intent, decisions, verified workflows, and previous pitfalls.

After fixing a bug or making a non-trivial project decision:
- Add or update a note in `.brain/Fixes/`, `.brain/Known-Issues/`, `.brain/Decisions/`, or `.brain/Runbooks/`.
- Include symptom, root cause, files changed, verification, and guidance for future agents when relevant.
- If a note is outdated, update it instead of silently working around it.
<!-- END:shared-brain-rules -->
