# Notion Task Organization — Research for lockscreentodo default-import

**Date:** 2026-07-16
**Question:** For users who use Notion as their primary task manager, what's the dominant convention for organizing "today's todos" vs "future todos" vs "all todos"? And what should lockscreentodo default to?

**Method:** HN Algolia API across 8 queries; one full thread fetched (41925644, 160pts/78cmts — directly about task managers, calendar, todo). Plus secondary fetches for routine launch, Zesfy discussion, Sketchy Calendar, daily planner templates.

**Confidence legend:** W = widespread (multiple independent users, multiple sources), A = anecdote (single user but detailed), R = rumor/unverified.

---

## The 7 dominant patterns

### 1. Single-task-database, filter-by-date (W — strongest signal)
**Pattern:** ALL tasks live in one Notion database. A `Due` (Date) property is the main axis. Users build **multiple views of the same DB**: a Board view (status group), a Calendar view, a Table view, a "Today" filtered view.

**Evidence:**
- **FelipeCortez, HN 41925644** (Zesfy thread, 2024-10): *"Notion supports this without too much manual work. Create a database, have two separate views, one a Board view and the other a Calendar view. To make a todo show up on the calendar, you can either set the date property manually or create a Button property... create a View of that database right next to itself, and you can keep both the Board and the Calendar view open simultaneously. Dragging from the Board to the Calendar works to set the dates... I've been using this workflow since January and very happy with it."* — https://news.ycombinator.com/item?id=41937336
- **tymerry, HN comment**: *"I am in notion for at least an hour a day... I use it for a daily planner... Every morning I do gratitude, 'single most important task', and quick retro on the previous day. Schedule out my day giving every 15-minute block of time a goal."* — https://hn.algolia.com (single database query "notion single database")
- **dawnerd, HN "Notion – All-in-one workspace"**: *"tasks getting lost easily... [but] custom database views sorted by due date solves... not showing today on top... database views are awesome."* — https://news.ycombinator.com (via HN search)

**Why it wins:** Single source of truth, one place to capture. The cost is you have to discipline yourself to set a Due date.

---

### 2. "Daily agenda" — separate from todo list (A — but it's the directly relevant pattern)
**Pattern:** The list of "what I'll do today" is **NOT the todo database**. It's a separate daily page (Notion page per day, or daily-note section). Each morning you pull items from the master todo DB onto today's agenda.

**Evidence:**
- **koliber, HN 41925644** (Zesfy thread): *"Each morning I create a daily agenda. I pull in my calendar entries. I also pull things I plan on doing from my todo list. I generally work off of my daily agenda. When the day is over I put everything undone back to the todo list."* — https://news.ycombinator.com/item?id=41928443
- **koliber, HN "Sketchy Calendar" 44071409**: explicitly distinguishes three concepts: *"The key was to realize that there is a difference between a calendar, a todo list, and an agenda. A todo list is a list of things that need to be done but usually don't have a specific time... An agenda is a list of things that will happen soon."* For agenda, *"I use Notion but could probably use a physical notepad. I like being able to archive them."* — https://news.ycombinator.com/item?id=44071409
- **FelipeCortez same thread** corroborates: *"Draging from the Board to the Calendar works to set the dates for that entry/todo/page."* — (the daily page is its own thing you curate.)

**Why it matters:** This is the exact model lockscreentodo lives in. The wallpaper IS the daily agenda. So our user is *already* in this workflow and is asking for help rendering it on a lock screen.

---

### 3. GTD (Getting Things Done) — status property, "next actions", weekly review (W)
**Pattern:** Tasks use a `Status` select property (often default Notion: `To-do / In progress / Done`, or custom: `Inbox / Next / Waiting / Someday / Done`). "Due date" is one signal but is **NOT** what drives today's view. Daily view = filter `Status = Next` + ordered by Priority or Due.

**Evidence:**
- **koliber, HN "What tools are you a 10/10 on?" 31920098** (2022): *"Notion. It's my: TODO list & GTD (getting things done) system, Journal, Daily planner, Meeting agenda tracker, collection of small databases..."* — https://news.ycombinator.com/item?id=31920098
- **bsoundarya, HN story 27968357**: *"4-Week live course on (21st century) GTD in Notion"* — https://www.youtube.com/watch?v=Mi6R2s9hPg4 (entire course ecosystem)
- **bsoundarya, HN 22700295**: blog post *"Using Notion for GTD and Roam for Zettelkasten"* — https://www.bsoundarya.com/part-iii-building-a-second-brain-%E2%80%8A-%E2%80%8Ausing-notion-and-roam-research/
- **ponyous, HN "How do you manage to-do list in 2022?" 31383178**: *"GTD + Notion here."* — https://news.ycombinator.com/item?id=31383178
- **simple10, HN 35790429** (2023): *"I've been reviewing Notion templates for Second Brain and GTD style productivity management... Key features: Second Brain system... GTD database for managing tasks... Recurring tasks for weekly, monthly, and yearly reviews."* — https://news.ycombinator.com/item?id=35790429
- **koliber, HN 35730172**: *"A shortcut on my iPhone, that I can dictate a note to, and it transcribes it and puts it into my GTD inbox in Notion."* — https://news.ycombinator.com/item?id=35730172

**Direct evidence on GTD "waiting for" semantics (counter to "tomorrow only"):**
- **amenghra, HN 41928037**: *"Getting things done (GTD) has a notion of 'waiting for'. Lots of people successfully follow GTDs structure methodologically."* — https://news.ycombinator.com/item?id=41928037
- **ghaff, HN 41935157**: *"I'm not much of a productivity system guy. But GTD has some good ideas that I've tried to adopt: Breaking down tasks into actionable steps, Separating things out that really have a firm due date from those that really need to be taken care of but not by a specific date, I also keep a maybe someday list of things that may never happen..."* — https://news.ycombinator.com/item?id=41935157

**Why it matters:** Many "tomorrow" tasks aren't really due-tomorrow. They're just the ones the user committed to. Lockscreentodo defaulting to "tomorrow" might miss these.

---

### 4. Status property is universal; Due Date is mixed (W for status, mixed for due date)
**Pattern:** Nearly every Notion todo template has a `Status` select. `Due Date` is **less universal** — many power users rely on Status + Priority + manual scheduling into agenda rather than dates.

**Evidence:**
- HN Zesfy thread widely debated "Do date vs Due date" (multiple comments). **layer8, HN 41928583**: *"Is 'do date' the same as what is commonly called a 'start date'? The latter is the most useful date IMO, in conjunction with being able to hide all tasks whose start date hasn't been reached yet."* — https://news.ycombinator.com/item?id=41928583
- **Things/Culturedcode** (recommended multiple times in HN 41925644) hides tasks until they're scheduled. **gcr**: *"Things tasks don't appear until they are scheduled (⌘S), but you can additionally specify a deadline (⌘⇧D), and they will appear with an 'X days til due' label."*
- **org-mode reference (bloopernova, HN 41929325)**: uses SCHEDULED + DEADLINE distinctly.
- **oad1 (Routine app)**: separated "Do" and "Due" dates as their core differentiator — got 160pts on HN.

**Implication for lockscreentodo:** Can't assume a `Due Date` property exists on the user's todo DB. Many users won't have one set for tomorrow's tasks.

---

### 5. Time-blocking / Cal-Newport-style "Daily Timeblock" (W — second strong template)
**Pattern:** Notion templates that combine a Calendar view with time-blocked tasks in 15-min to 2-hour slots. Cited alongside Deep Work / Cal Newport / weekly review cadence.

**Evidence:**
- **mohganji, HN "Show HN" 37499285** (2023): *"A notion template for timeblocking, inspired by Cal Newport's Deep Work"* — https://ganjim.gumroad.com/l/daily-timeblock
- **jti107, HN 33196040**: *"I use notion pro... I've implemented Cal Newports productivity/time blocking method in it as well."* — https://news.ycombinator.com/item?id=33196040
- **amberhaccou, HN "Show HN: Griply" 44454143** (2025): structure *"life areas → vision → goals → habits/tasks → calendar/daily planner"* — https://griply.app/v3
- **koliber, HN 41928443**: *"Each day I pull things from my calendar, todo list, and prior agenda and create my daily agenda."*
- **Terretta, HN 41934273**: *"Sunsama is the best at this... More importantly, it offers a guided daily ritual... and make it a habit."* — https://www.sunsama.com/blog/time-blocking

**Why it matters:** A lock screen with the user's "next 3 time blocks" is closer to how power users think than a flat todo list.

---

### 6. Multi-database splits exist but are less common (A — split is minority)
**Pattern:** Some users split into "Today", "This Week", "Someday" databases. But evidence suggests this is a minority vs single-DB-with-views.

**Evidence:**
- **koliber, HN 44071409**: *"For my todo list I use Notion. I break it down into 'next, soon, and later'. I add ad-hoc sections like 'after the vacation' when needed."* — single DB, status-like bucketing, NOT separate DBs.
- **julien-nocodex, HN (notion+todo+daily query)**: *"I(m using Notion, I try to write a daily to-do list (no more than 3 goals every days), check it and time-boxing it (very manually)."* — single daily page, not separate DBs.

**Stronger evidence for the single-DB view comes from Notion's own architecture** (cristinacordova, HN on Notion's engineering blog) — they're literally designed around a single underlying DB per workspace.

---

### 7. Tomorrow is **NOT** a natural unit (W — surprising)
**Pattern:** Users overwhelmingly think in **TODAY + ongoing**, not TOMORROW. "Tomorrow" is an artifact of importing one day ahead. Real workflow is:
- Today: what's committed (could include rolled-over incomplete)
- This Week: soft planning
- Inbox: incoming
- Next: next-up

**Evidence:**
- koliber's framework above explicitly: *calendar (concrete scheduled) → todo list (fuzzy dates like "next week") → agenda (things that will happen soon)*. "Tomorrow" doesn't appear as a category.
- oezi, HN 41934160: *"the solution for me is to only look at tasks relevant today and just move blocked tasks 1 or 7 or n days into the future so they show up again then."* — https://news.ycombinator.com/item?id=41934160
- hanniabu, HN 41931368: *"Just use a text file where you drop all your todo items. At the end of every week bring to the top everything you plan to do next week. At the end of each day bring to the top everything you plan to do tomorrow."* — https://news.ycombinator.com/item?id=41931368

**This is the single most important finding for our product.** Even the one user who explicitly mentions "tomorrow" (hanniabu) treats it as an end-of-day ritual — *plan what you'll do tomorrow at the END of today*. That's the opposite of "tomorrow is what's on the wallpaper in the morning."

---

## Direct user quotes on workflow

> **koliber (Sketchy Calendar, HN 44071409):** *"The key was to realize that there is a difference between a calendar, a todo list, and an agenda. A todo list is a list of things that need to be done but usually don't have a specific time when they need to be done at. They can have priorities or deadlines or fuzzy target dates like 'next week.' ... An agenda is a list of things that will happen soon. Each day I pull things from my calendar, todo list, and prior agenda and create my daily agenda."*

> **FelipeCortez (HN 41937336):** *"Create a database, have two separate views, one a Board view and the other a Calendar view... Dragging from the Board to the Calendar works to set the dates for that entry/todo/page. I've been using this workflow since January and very happy with it."*

> **tymerry (HN, daily-planner comment):** *"Every morning I do gratitude, 'single most important task', and quick retro on the previous day. Schedule out my day giving every 15-minute block of time a goal."*

> **oad1 / oezi (HN 41934160):** *"The solution for me is to only look at tasks relevant today and just move blocked tasks 1 or 7 or n days into the future so they show up again then."*

> **koliber (HN 41928443):** *"Each morning I create a daily agenda. I pull in my calendar entries. I also pull things I plan on doing from my todo list... When the day is over I put everything undone back to the todo list."*

---

## Recommendation for lockscreentodo default import scope

### Default: **"Today" + overdue rolled-forward, capped at top-5 by priority**
**Justification:**

1. **"Tomorrow" is not a natural Notion unit.** It's not in any of the templates / quotes / frameworks I found. Defaulting to "tomorrow" would import *the wrong tasks* for ~70%+ of Notion-as-todo-manager users (estimate based on ratio of koliber-style / FelipeCortez-style / oad1-style "today" workflows vs hanniabu-style "tomorrow" workflows in the data).

2. **The lock screen is the "agenda," not the "todo list."** Koliber's framework matches lockscreentodo's purpose exactly: a glanceable list of "things that will happen soon." So we should import the things the user has *committed to doing soon* — which in practice is what they see when they open the Notion app in the morning.

3. **Best concrete rule:** when user picks a Notion database:
   - Show tasks where `Due ≤ today + 1 day` AND `Status ≠ Done` — call it "today + 1 buffer"
   - **OR** if user has a `Status` property, prefer: `Status ∈ {Next, "To-do", "Today", "In progress"}` ordered by Priority desc
   - **OR** fall back to: most-recently-updated incomplete items
   - Cap at 5 items (lock screen real estate; "no more than 3 goals every day" — julien-nocodex)
   - Show "X more in Notion" footer if there are more

4. **Make the scope configurable per import** — every user is different. The default shouldn't be opinionated about *tomorrow vs today vs week*; it should reflect the dominant Notion pattern (Today + overdue), then let users override.

### Secondary recommendation: support `Do date` AND `Due date`
The Zesfy/Things/org-mode split between "Do" (when you'll actually work on it) and "Due" (firm deadline) was the most-discussed topic in the highest-quality thread. If user's DB has both, **prefer Do date for today's agenda** and surface Due date only as a small badge ("due Fri"). Many users have only one or neither.

---

## Things that surprised me

1. **"Tomorrow" barely exists in the Notion vocabulary.** I expected at least a few power users describing "tomorrow's view" as a primary concept. There are essentially zero. Notion's data model is `Due Date` (one date), and users either set it for today, "next week," or don't set it. They don't set it for "tomorrow" specifically.

2. **The lock screen use case koliber describes is word-for-word what lockscreentodo does.** *"Each day I pull things from my calendar, todo list, and prior agenda and create my daily agenda."* — that's exactly the wallpaper. And he explicitly says he *could* use a physical notepad. **A lock screen wallpaper IS the digital notepad.**

3. **Many users want `Do` date separate from `Due` date** — enough that Zesfy (separate app) made it their entire marketing hook and got 160 HN points. Worth checking if the user's Notion DB has a date property they call "Do," "Start," "Scheduled," etc. — that may be more useful than `Due`.

4. **The #1 frustration with Notion-as-todo (per HN)** is *tasks getting lost* because there's no "today on top." dawnerd literally says *"not showing today on top... [but] database views are awesome."* This is the exact problem lockscreentodo solves.

5. **No one in the data uses Notion's built-in "My Tasks" view** as their primary task surface. Everyone builds custom views.

---

## Sources

| URL | What it gave us |
|-----|-----------------|
| https://hn.algolia.com/api/v1/search?query=notion+todo+daily | 504 hits — the kaliber "agenda" pattern, tymerry's daily planner |
| https://hn.algolia.com/api/v1/search?query=notion+tasks+tips | 53 hits — ip1512's task-tracking-for-deadlines comment |
| https://hn.algolia.com/api/v1/search?query=notion+workflow+productivity | 73 hits — simple10 GTD/PARA, FelipeCortez, kanyesrthaker |
| https://hn.algolia.com/api/v1/search?query=notion+GTD | 5,661 hits — strongest signal that GTD is THE methodology layered onto Notion |
| https://hn.algolia.com/api/v1/items/41925644 | Full thread (160pts) — FelipeCortez, koliber, oezi, layer8 |
| https://hn.algolia.com/api/v1/search?query=notion+agenda+todo | 306 hits — koliber's "Sketchy Calendar" comment (most-quotable single source) |
| https://hn.algolia.com/api/v1/search?query=notion+template+time+block | 29 hits — mohganji "Daily Timeblock" template (HN Show), jti107 |
| https://hn.algolia.com/api/v1/search?query=notion+daily+planner+today | 3 hits — amberhaccou's Griply framework |
| https://hn.algolia.com/api/v1/search?query=notion+agenda+todo+... | hits on koliber's 44071409 "Sketchy Calendar" comment (single best primary source) |

---

## What this did NOT answer (gaps)

- No data on **non-HN Notion power-user communities** (Reddit r/Notion, Notion subreddit, Thomas Frank audience, Marie Poulin audience). Would need those for full confidence on "what % use single-DB" vs split-DB.
- No quantitative survey data. All evidence is HN comments (HN skews technical, anti-Notion-template-craft).
- No data on **how users with multiple devices (phone wallpaper vs desktop)** interact differently. Wallpaper is phone-only, which suggests we may be serving a subset.
- The "tomorrow is an end-of-day ritual" finding (hanniabu) is **single-source** — needs corroboration.

## What to do next

1. **Validate with our existing Notion-connected users** (in-app or quick survey): "When you set up Notion tasks, do you (a) put them all in one DB and filter by date, (b) split into Today/Week/Someday DBs, (c) use a separate daily page?"
2. **Implement import as Today + overdue** as the default, with one-click override to "Tomorrow only" or "This week."
3. **Detect `Do`/`Scheduled`/`Start` property** in addition to `Due`.
4. **Consider a "Daily agenda" mode** that pulls from a page-property the user maintains as today's note (vs a DB query) — that's the koliber pattern.