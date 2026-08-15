# Laboratory Activity 2 — Brief to Prototype

**CSci 153 · Web Systems and Technologies**
Module 1 · Lesson 1.2 · Week 3 · Assessment task **CA 2**
Course outcome **CO1** · Learning outcome **LO 1.2**

---

## Scenario

Pick **one screen** from the web application you intend to build for your final
project. Take it from a blank page to a reviewed, state-complete prototype using the
full agentic loop — and document the loop as you go.

Pick the screen that carries the most information. A login page is not enough.

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

### 1 · Design brief (`brief.md`)

Use the builder on the Lesson 1.2 slide. It must state:

- **Product and user** — who, on what device, in what conditions
- **The screen's one job** — a single sentence
- **Stack** — the one you will actually use in Module 2
- **Tokens** — pasted in full, not referenced
- **Constraints** — accessibility, minimum width, no libraries, states required
- **Real data shape** — including the longest realistic values, not tidy samples

### 2 · The agent's plan, with your corrections marked (`plan.md`)

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

### 3 · Two screens (`v1.html` and `final.html`)

Keep both files. The first generation is evidence, not embarrassment.

- `v1.html` — exactly what came out of step 03, unedited
- `final.html` — after your review and iterations

### 4 · Completed QA sheet (`qa.md`)

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
  brief.md
  plan.md
  v1.html
  final.html
  qa.md
```

---

## Rubric — 100 points

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Brief completeness** | 20 | All seven brief elements present; a competent classmate could build the right screen from it alone. |
| **Plan review** | 15 | Real corrections to the proposed plan, each justified by a principle from Lesson 1.1. |
| **The v1 → final gap** | 25 | The diff shows substantive, principled improvement — not cosmetic tweaks. |
| **QA sheet honesty and precision** | 20 | Failures identified specifically; corrections written as measurements, not adjectives. |
| **Final screen quality** | 15 | Token-driven, state-complete, accessible, holds at 320px. |
| **Craft** | 5 | Reads as one deliberate system, ready to become components in Module 2. |

**Automatic deductions**

- `v1.html` missing or edited after the fact — **−25** (the diff is the submission)
- Corrections written as adjectives, e.g. "make it cleaner" — **−3 each**, maximum −12
- Any hard-coded hex in `final.html` — **−5 each**, maximum −15

---

## Where this goes next

| Feeds into | How |
|---|---|
| **Module 2 · Frontend** | This screen becomes your first real Next.js + Tailwind components; `tokens.css` becomes your theme configuration. |
| **Final Project (FP, 20%)** | The design system established here carries every screen you ship in week 17. |
| **Practical Exam (PE, 15%)** | You will defend these decisions out loud, with the screen in front of you. |

---

## Checklist before you upload

- [ ] Brief states product, user, job, stack, tokens, constraints, and real data shape
- [ ] Asked for a plan and waited before allowing generation
- [ ] `v1.html` saved untouched, before any correction
- [ ] All 8 QA checks run and recorded honestly
- [ ] Every correction reads as a measurement, not a mood
- [ ] `final.html` uses tokens only
- [ ] Tabbed it, zoomed it, resized to 320px
- [ ] You can explain every line in the file
