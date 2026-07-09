# AI Coding Skills

> Load `.brain/SKILLS.md` for full documentation with detailed rules and examples.

## Quick Reference

### Think Before Coding
- Don't assume. Surface tradeoffs upfront.
- Multiple interpretations? Present them — don't pick silently.
- Something unclear? Stop. Name what's confusing. Ask.

### Simplicity First
- Minimum code that solves the problem. Nothing speculative.
- If you write 200 lines and it could be 50, rewrite it.
- Only add complexity when you actually need it.

### Surgical Changes
- Touch only what you must. Clean up only your own mess.
- Don't "improve" adjacent code, comments, or formatting.
- Match existing style, even if you'd do it differently.

### Goal-Driven Execution
- Define success criteria. Loop until verified.
- Write tests for bugs before fixing them.
- Multi-step tasks: state a plan with verification at each step.

### Verification Gates (this repo)
Before pushing any commit that touches `.ts`/`.tsx` files, run locally:

```bash
npx tsc --noEmit
```

**Why**: Vercel runs the same TypeScript check during build. A failed tsc
locally means a failed deploy remotely — and each failed deploy burns the
5-min Secret Guard scan + a redeploy round-trip. One local command beats
three remote cycles.

**When to skip**: only when the user explicitly says "just push it" or the
change is config/docs/scripts with no `.ts`/`.tsx` edits.

**Scope rule**: stage with explicit file paths (`git add path/to/file`),
never `git add -A` or `git add .` — keeps untracked credential files out
of commits.

## When to Apply
- Writing new code
- Editing existing code
- Reviewing code
- Refactoring code
- Planning code changes

**Skip only when:** User explicitly says "just do it fast", pure config files, or throwaway prototypes.

## See Also
- `.brain/SKILLS.md` — Full documentation (Obsidian format)
- `.brain/Skills/universal-coding-principles.md` — 4 principles with examples
- `.brain/Skills/rust-skills.md` — 179 Rust-specific rules
- `.brain/Skills/principles-examples.md` — Before/after examples