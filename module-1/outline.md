# Module 1 — UI/UX Design · outline

**CSci 153 · Weeks 1–3 · Milestone 1 · CO1 and CO2**
Syllabus LOs: **LO 1.1** design principles · **LO 1.2** wireframes and prototypes ·
**LO 2.1** reusable UI components with React + Tailwind · **LO 2.2** cross-device responsiveness

Status: **ready** — 65 slides, `module-1/index.html`.

> ## The milestone
>
> **Design the screen, then build it.** By the end of week 3 a group has a clickable,
> responsive, static prototype of every screen in its system, in a repository, with every
> member having commits. No data, no fetch calls, no backend.
>
> That boundary is the point. A screen with nothing behind it is still a finished piece of
> design work, and it is the artifact every later milestone is measured against.

---

## Lesson order

| # | Lesson | LO | Slides | Why it sits here |
|---|---|---|---|---|
| 1.1 | **UI/UX practice** | 1.1 | 24 | Hierarchy, spacing, type, colour, contrast, the seven states, tokens |
| 1.2 | **Agentic design** | 1.2 | 14 | Context → plan → generate → review, with the 8-point QA as the review step |
| 1.3 | **Git & GitHub — briefly** | *(no LO)* | 7 | The repository the milestone is delivered into |
| 1.4 | **Components from mockups** | **2.1, 2.2** | 8 | The mockup becomes static, responsive React. React itself is assumed |

**1.3 and 1.4 were Module 2's lessons 2.0 and 2.1** before the milestone resequencing
(`../plan/milestones.md`). They moved because version control is where design work is
*delivered*, and because building a screen with no data in it is the last step of designing
it rather than the first step of wiring it.

---

## 1.3 · Git & GitHub — the brief version

**Not covered by any syllabus LO**, and deliberately short: one session, practical only.
The Final Activity Project is group work in a shared repository, so this is the minimum
that keeps a group from stepping on itself — not a course in version control.

Cover, quickly: branch per feature · commit messages that name the change · pull request
with one required approval · issues and milestones as the work queue · what a merge
conflict is and how not to panic. Demonstrate a conflict live and resolve it once.

Skip entirely: rebasing, cherry-picking, submodules, git internals.

**Assessment hook:** every group member must have commits by the end of week 3. This is
also how individual contribution to a group grade is evidenced later.

---

## 1.4 · Components from mockups

A bridge, not an introduction — React was taught in the prior course and is not repeated.
The session spends its time on *what to build* and *how to structure it*: component
boundaries, props as a contract, too many props, tokens becoming the Tailwind theme, and
the seven states expressed as variants.

**This lesson carries both of CO2's outcomes.** LO 2.1 is the reusable components; LO 2.2
is the responsiveness built into them with Tailwind breakpoints. LO 2.2 previously sat on
lesson 2.5 (*Data states in practice*, now 4.3), which is the wrong home for it —
responsiveness is attained when a component is built responsive, not when it first receives
real data. The retag is recorded in `../plan/milestones.md`.

**Static only.** No `fetch`, no Context, no query client. Those are Module 4, after there
is something to talk to.

---

## Laboratory

| Activity | Week | Individual / group |
|---|---|---|
| **A1** UI audit and redesign | 2 | individual |
| **A2** Brief → prototype | 3 | group |
| **A3** Prototype → components | 4 | individual — **the milestone gate** |

---

## Carried forward

- The 8-point design QA runs on every generated screen, all semester
- Tokens are the Tailwind theme from 1.4 onward — same three layers
- The prompt log continues as a graded artifact
- The repository, the branch protection and the review habit set up in 1.3
