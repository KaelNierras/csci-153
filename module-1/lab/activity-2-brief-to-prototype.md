# Laboratory Activity 2 — Brief to Prototype

**CSci 153 · Web Systems and Technologies**
Module 1 · Lesson 1.2 · Week 3 · Assessment task **CA 2**
Course outcome **CO1** · Learning outcome **LO 1.2**

> ### Part group, part individual — read this before you start
>
> Your group is formed and your system is assigned **before the week 3 session**, so
> by the time you start this activity you know which of the three Final Activity
> Project systems you are building.
>
> | | Produced by | Why |
> |---|---|---|
> | **Design brief** (`brief.md`) | **The group — one copy** | Product, user, stack, constraints, and data shape are facts about *the system*, not about you. Four different answers would mean four different products. |
> | **Token set** (`tokens.css`) | **The group — one copy** | This becomes the Tailwind theme in Module 2 and every screen shipped in week 17. A project has exactly one design system. |
> | **Plan, both screens, QA sheet** | **Each member, individually** | Each of you takes a **different screen** of the same system and runs the full loop yourself. |
>
> So the group agrees *what it is building and what it looks like*; each member then
> proves they can personally drive an agent to build a piece of it. Unlike
> [Activity 1](./activity-1-ui-audit-and-redesign.md), which is individual end to end.
>
> This is not busywork framing — it is the actual arithmetic. A four-person group
> finishes week 3 with **one design system and four reviewed screens**, all of which
> carry into Module 2. Done individually, you would produce four competing token sets
> and throw three of them away.

---

## Scenario

Your group picks the system it will build; **you** pick **one screen** from it that
no other member of your group has claimed. Take that screen from a blank page to a
reviewed, state-complete prototype using the full agentic loop — and document the
loop as you go.

Pick the screen that carries the most information. A login page is not enough.

> **Claim your screen in writing.** Post the split in your group's channel or repo
> issue before you start generating, so two people don't arrive at the same screen.
> Use the §7 sitemap in your system's specification document to divide them — it
> already lists every route. If your group has more members than substantial screens,
> pair up on the largest one but submit separate briefs of the loop; do not submit
> the same `final.html` twice.

> **You are not graded on what the agent produced first.** You are graded on the gap
> between generation one and your final version. That gap is the only place your
> design judgment is visible.

---

## The loop you are documenting

```
  01 Context   →   02 Plan   →   03 Generate   →   04 Review   →   05 Iterate
       │              │              │                │               │
   brief +        components     one screen,      8-point QA      measured
   tokens +       and states,    uninterrupted,   run by you      corrections,
   constraints    reviewed       tokens only                      one theme/turn
                  by you                                              │
                                                                      └──► back to 03
```

---

## What you submit

### 1 · Design brief (`brief.md`) — **agreed by the group, submitted by every member**

Write it once as a group; every member includes the identical file in their own zip,
plus one line at the top naming the screen *they* took. Use the builder on the
Lesson 1.2 slide. It must state:

- **Product and user** — who, on what device, in what conditions
- **The screen's one job** — a single sentence
- **Stack** — the one you will actually use in Module 2
- **Tokens** — pasted in full, not referenced
- **Constraints** — accessibility, minimum width, no libraries, states required
- **Real data shape** — including the longest realistic values, not tidy samples

### 2 · Token set (`tokens.css`) — **agreed by the group, submitted by every member**

The same three-layer structure as [Activity 1](./activity-1-ui-audit-and-redesign.md)
— neutral ramp, one accent, three semantics, type scale, spacing scale, each layer
commented. Your group almost certainly has several candidates already, one per member
from Activity 1: pick one and refine it together, or merge them. Do not average them
into mush, and do not let each member keep their own.

This file is the one Module 2 turns into `tailwind.config` theme values, so it is
worth the argument now rather than in week 4.

### 3 · The agent's plan, with your corrections marked (`plan.md`) — **individual**

Paste the plan it produced *before* it wrote any code, then mark your edits:

```md
- SubjectCard: default, hover, disabled
+ SubjectCard: default, hover, FOCUS, disabled          ← focus was missing
- SubjectList: renders cards
+ SubjectList: renders cards + EMPTY + ERROR states     ← only happy path proposed
```

If the plan needed no corrections, say so and explain how your brief prevented the
usual gaps. That is a legitimate answer — but it is rare, and I will read the brief
carefully.

### 4 · Two screens (`v1.html` and `final.html`) — **individual**

Keep both files. The first generation is evidence, not embarrassment.

- `v1.html` — exactly what came out of step 03, unedited
- `final.html` — after your review and iterations

### 5 · Completed QA sheet (`qa.md`) — **individual**

For each of the 8 checks: pass or fail **on the first generation**, what specifically
failed, and the exact correction you sent.

| # | Check | v1 | What failed | Correction sent |
|---|---|---|---|---|
| 01 | Hierarchy | ✕ | Three elements at 24px; nothing ranks first | "The screen title should be the only element above 20px. Drop the section headers to the 16px step." |
| 02 | Tokens | | | |
| 03 | Contrast | | | |
| 04 | States | | | |
| 05 | Keyboard | | | |
| 06 | 320px | | | |
| 07 | Real data | | | |
| 08 | Copy | | | |

A sheet with 8 passes on the first generation will be spot-checked in the practical
exam. If it holds up, excellent. If it does not, it is an integrity matter.

---

## Submission

- **Where** — VSU E-Learning Portal, Module 1 folder
- **When** — before the start of the week 4 session
- **What** — `SURNAME_A2.zip` containing:

```
SURNAME_A2/
  brief.md        ← group copy, identical across your group, with your screen named at the top
  tokens.css      ← group copy, identical across your group
  plan.md         ← yours
  v1.html         ← yours
  final.html      ← yours
  qa.md           ← yours
```

Every member uploads their own zip. Two members of the same group submitting the same
`final.html` is a zero for both — the shared half is the brief and the tokens, nothing
past that.

---

## Rubric — 100 points

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Brief completeness** | 20 | All seven brief elements present; a competent classmate could build the right screen from it alone. Graded once per group — every member receives the same mark for this row. |
| **Plan review** | 15 | Real corrections to the proposed plan, each justified by a principle from Lesson 1.1. |
| **The v1 → final gap** | 25 | The diff shows substantive, principled improvement — not cosmetic tweaks. |
| **QA sheet honesty and precision** | 20 | Failures identified specifically; corrections written as measurements, not adjectives. |
| **Final screen quality** | 15 | Token-driven, state-complete, accessible, holds at 320px. |
| **Craft** | 5 | Reads as one deliberate system, ready to become components in Module 2. |
| **Fits the group's system** | — | Not scored separately, but a screen built on different tokens than the group's, or a duplicate of another member's screen, forfeits the Craft points and the Brief row. |

**Automatic deductions**

- `v1.html` missing or edited after the fact — **−25** (the diff is the submission)
- Corrections written as adjectives, e.g. "make it cleaner" — **−3 each**, maximum −12
- Any hard-coded hex in `final.html` — **−5 each**, maximum −15

---

## Where this goes next

| Feeds into | How |
|---|---|
| **Module 2 · Frontend** | Your group arrives with several screens already designed; they become your first real React + Tailwind components, and the shared `tokens.css` becomes the Tailwind theme. |
| **Final Web Project (FWP, 50%)** | Group work. The design system your group establishes here carries every screen it ships in week 17. |
| **Codebase Assessment (CA, 20%)** | Read off the repository in weeks 16–17. You answer for *your* screens — which is why you each run the loop yourself rather than watching someone else run it. |

---

## Checklist before you upload

- [ ] Group agreed one brief and one `tokens.css`, and both are in your zip
- [ ] Your screen is claimed in writing and is not another member's screen
- [ ] Brief states product, user, job, stack, tokens, constraints, and real data shape
- [ ] Asked for a plan and waited before allowing generation
- [ ] `v1.html` saved untouched, before any correction
- [ ] All 8 QA checks run and recorded honestly
- [ ] Every correction reads as a measurement, not a mood
- [ ] `final.html` uses tokens only
- [ ] Tabbed it, zoomed it, resized to 320px
- [ ] You can explain every line in the file
