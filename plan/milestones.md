# The four milestones

**Decided 2026-09-22.** The course is five modules, and each module is a development
milestone, in the order a group actually builds a system:

```
1 · UI/UX  →  2 · Contract  →  3 · Backend  →  4 · Frontend  →  5 · QA
   design       agree the       implement       consume it,      prove it works,
   the screen   shape of        the shape       validate, ship   hand it over
                the data
```

There is no longer a distinction between "module" and "milestone". A module *is* a
milestone: one deck, one gate, one artifact handed to the next module.

---

## Why the order changed

The old sequence was five modules — UI/UX, Frontend, JavaScript, Backend, Integration —
and it taught the frontend before the backend: Module 2 in weeks 3–5, Module 4 in weeks
7–8. That put two problems in the course.

**The contract was authored before anyone could model data.** Groups wrote `openapi.yaml`
in week 4 and did not learn schema modelling until Module 4. The old `module-4/outline.md`
said so out loud — *"expect breaking changes here, and say so in advance."* Planned rework
is still rework.

**The build order did not match the teach order.** Students were told to build a frontend
against a mock, then five weeks later build the thing the mock stood in for. That is a real
professional workflow, but it is a *second* workflow to learn, on top of the stack itself,
in a second-year course.

The new order fixes both. Data modelling sits at the head of the Contract module — you
model what exists, then you write down how it is exposed, then you implement it, then you
consume it. Each module hands the next one an artifact it cannot proceed without.

**What it costs.** Contract-first loses some of its force. Under the old order the frontend
genuinely could not see a backend for five weeks, which made the argument for itself. Now
the gap is three weeks and the mock is a bridge rather than a way of life. The argument has
to be *made* in lesson 2.2 rather than demonstrated by the calendar. The Prism mock stays —
it is what lets Module 2 produce running screens — but its job is now pedagogical.

---

## The five modules

| # | Module | Taught | Built | Slides | Gate |
|---|---|---|---|---|---|
| **1** | **UI/UX** | W1–3 | W2–4 lab | 65 | A clickable static prototype of every screen, passing the 8-point QA |
| **2** | **The Contract** | W4–6 | W4–6 lab | 35 | `openapi.yaml` with a data model behind it, types generated, screens on the mock |
| **3** | **Backend** | W7–8 | Sprints 1–2 (W10–13) | 42 | `contract:check` passes, and another group's account cannot read your rows |
| **4** | **Frontend** | Clinics W11–13, 15 | Sprints 2–3 (W12–15) | 37 | The app runs on its own backend at a URL someone outside the group can open |
| **5** | **QA & Acceptance** | W14 clinic, W16–17 | Sprint 4 (W16–17) | 21 | A Day In The Life run completes across every role, driven by an outsider, with no blocking defect |

### Where every old lesson went

The five old decks were re-cut into these four. Two things were discarded: the old Module 2's
orientation and closing slides, which belonged to a module that no longer exists, and — on
2026-09-22 — **the entire stack tour**, in two rounds: first the JavaScript and React
lessons, then *The stack, named*, *TypeScript in five ideas*, *JSON, fetch and await* and
*Choosing a library*. The previous subject covered JavaScript, React and npm/tooling, and
generated types were deferred to Modules 3 and 4 where they are actually produced and used.

| Old | New | Lesson |
|---|---|---|
| 1.1 | **1.1** | UI/UX practice |
| 1.2 | **1.2** | Agentic design |
| 2.0 | **1.3** | Git & GitHub |
| 2.1 | **1.4** | Components from mockups |
| 4.1 | **2.1** | Modelling the data |
| 2.3 | **2.2** | The API contract — OpenAPI |
| 3.1–3.7 | *removed* | The whole stack tour — prior course, see below |
| 3.8 | **2.3** | Does it work? — Vitest |
| 4.2 | **3.1** | Migrations |
| 4.3 | **3.2** | CRUD endpoints over the schema |
| 4.4 | **3.3** | Row Level Security |
| 4.5 | **3.4** | Constraints and triggers |
| 4.6 | **3.5** | Edge Functions |
| 4.7 | **3.6** | Implementing the contract |
| 5.4 | **3.7** | CI |
| 2.2 | **4.1** | Auth Context + route protection |
| 2.4 | **4.2** | API wrapper, interception, server state |
| 2.5 | **4.3** | Data states in practice |
| 5.1 | **4.4** | Two-layer validation |
| 5.2 | **4.5** | Integration day |
| 5.5 | **4.6** | Deployment |
| 5.3 | **5.1** | End-to-end testing |
| — | **5.2** | Test cases as issues — expanded from one slide |
| — | **5.3** | **Day In The Life — new** |
| — | **5.4** | The 12-point QA pass |
| 5.6 | **5.5** | Codebase assessment |

### The five moves that made it work

1. **Old 2.1 (components) moved into Module 1.** Building a screen with no data is the last
   step of designing it. It also stops students spending three weeks in YAML and SQL with
   nothing on screen.
2. **Old 4.1 (data modelling) moved to the head of Module 2**, ahead of the contract.
3. **The old Module 3 is gone.** Its material was either prior-course or belonged where the
   thing it describes is produced: generated types in Module 3, the typed client in Module 4.
4. **Old 5.4 (CI) moved up into week 8**, so the development phase is gated from its first
   pull request rather than its sixth.
5. **QA became its own milestone** (2026-09-22). End-to-end testing and the codebase
   assessment left Module 4, and **Day In The Life acceptance testing** was written to sit
   between them. Before this, the course's entire quality story was an appendix to the
   frontend module.

---

## Every syllabus outcome still lands where it did

The syllabus week column reads as *"when this outcome is attained and assessed"*, the
framing the 8-week calendar already established. Under the new sequence that reading holds
without strain, because **nothing carrying an LO moved later.**

| CO | LOs | Attained | Assessed | Change |
|---|---|---|---|---|
| **CO1** | 1.1, 1.2 | W1–2, lessons 1.1–1.2 | A1 (W2), A2 (W3) | none |
| **CO2** | 2.1, 2.2 | **W3**, lesson 1.4 | A3 (W4) | **earlier** |
| **CO3** | 3.1 | **Module 3**, *Generated types, again* | A7 (W7) | **relocated** |
| **CO3** | 3.5 | **Module 4**, lesson 4.2, the typed client | A9 (W15) | **relocated** |
| **CO3** | 3.2, 3.3, 3.4, 3.6, 3.7 | **prior course**, verified W5 | week-5 diagnostic | **not lectured** |
| **CO4** | 4.1, 4.2 | 4.1 in **W4** (lesson 2.1); 4.2 in W7–8 | A7 (W7), A8 (W8) | LO 4.1 earlier |
| **CO5** | 5.1, 5.2 | W13 clinic | A9 (W15) | none |
| **CO5** | 5.3 deployment | W15 clinic, lesson 4.6 | A9 (W15) | none |
| **—** | *Milestone 5 carries no syllabus LO* | W14, W16–17 | A10 (W16), Codebase Assessment | every project spec requires it |

**Module numbers are no longer course-outcome numbers.** That mapping was convenient but it
was never required — the syllabus attaches outcomes to learning outcomes, not to deck
covers. The table above is the mapping, and it is repeated in each module's `outline.md`
header and on the semester plan page. Modules 1 and 2 each carry two COs; that is the cost
of ordering the course by how a system is built rather than by how the outcomes are numbered.

### The one retag this required

LO 2.2 — *cross-device responsiveness* — was tagged on the old lesson 2.5 (*Data states in
practice*), which is now lesson 4.3, a week-12 clinic. It is retagged onto **lesson 1.4**,
in week 3.

This is the more honest placement regardless of the resequencing. Responsiveness is attained
when a component is built with Tailwind breakpoints that work, which is 1.4's whole exercise.
What 4.3 adds is *real latency*, which is a data-states concern, not a responsiveness one.

Everything else that moved into the development phase — 4.1, 4.2, 4.3 — carries no syllabus
LO. **All ten activities keep their original weeks.**

---

## Known risks

| Risk | Mitigation |
|---|---|
| **Module numbers no longer equal CO numbers.** An audit that expects Module 4 ≡ CO4 will not find it. | The CO table above is reproduced in every `outline.md` header and on the plan page. Each lesson still carries its LO tag in the deck itself, which is where an assessor actually looks. |
| **Five of CO3's seven outcomes are not lectured anywhere.** The whole stack tour was removed on 2026-09-22 — the previous subject covered JavaScript, React, and npm/tooling. LO 3.1 relocated to Module 3 and LO 3.5 to Module 4; 3.2, 3.3, 3.4, 3.6 and 3.7 are prior-course. | **This is the course's largest OBE exposure.** The deck's *Assumed knowledge* slide and its CO3 table state it openly rather than hiding it. **The week-5 prior-knowledge diagnostic now exists** (`module-2/lab/`) and is the only evidence for those five outcomes — so the risk moves from *writing* it to *running it and keeping the cohort summary*. Skip that and five outcomes rest on an assertion. |
| **Contract-first is now argued rather than demonstrated.** The three-week gap is short enough that a group could skip the mock and wait for the backend. | Module 2's gate is running screens on the Prism mock. A group that waited has nothing to show at the week-6 gate. |
| **Week 4 carries both data modelling and the contract**, two dense inputs in one 2-hour block. | The normalisation stepper and the spec explorer are the instruments; the lab that week is the ERD-and-contract clinic, so modelling gets three lab hours immediately after. |
| **Module 4 is entirely clinics**, so a group behind on the backend has no time for it. | The sprint-2 gate is `contract:check`, not screens. Groups that are behind lose hardening time in sprint 4, which is the intended failure mode. |
| **The reference app's git history is in the old order.** | See `../reference-app/BUILD-PLAN.md`. Explain it in week 7 or rebase before week 1. |
| **Milestone 5 has no syllabus outcome behind it**, so it is the first thing that gets squeezed if the semester slips. | It carries the Codebase Assessment (20%) and the Final Web Project demonstration, which between them are 70% of the grade. Cutting it is not available. |
| **The Day In The Life run needs an outsider to drive it**, and week 16 is when every group needs one at the same time. | Groups drive each other's, in pairs, in the week-16 lab. That also makes each group read a system they did not build, which is the Codebase Assessment rehearsed. |
