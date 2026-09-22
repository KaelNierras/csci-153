# The four milestones

**Decided 2026-09-22.** The course is four modules, and each module is a development
milestone, in the order a group actually builds a system:

```
1 · UI/UX  →  2 · Contract  →  3 · Backend  →  4 · Frontend
   design       agree the       implement       consume it,
   the screen   shape of        the shape       validate, ship
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

## The four modules

| # | Module | Taught | Built | Slides | Gate |
|---|---|---|---|---|---|
| **1** | **UI/UX** | W1–3 | W2–4 lab | 65 | A clickable static prototype of every screen, passing the 8-point QA |
| **2** | **The Contract** | W4–6 | W4–6 lab | 56 | `openapi.yaml` with a data model behind it, types generated, screens on the mock |
| **3** | **Backend** | W7–8 | Sprints 1–2 (W10–13) | 42 | `contract:check` passes, and another group's account cannot read your rows |
| **4** | **Frontend** | Clinics W11–15 | Sprints 2–4 (W12–17) | 45 | The app runs on its own backend at a URL someone outside the group can open |

### Where every old lesson went

The five old decks were re-cut into these four. Two things were discarded: the old Module 2's
orientation and closing slides, which belonged to a module that no longer exists, and — on
2026-09-22 — **the three JavaScript and React lessons**, because that material was taught in
the prior course.

| Old | New | Lesson |
|---|---|---|
| 1.1 | **1.1** | UI/UX practice |
| 1.2 | **1.2** | Agentic design |
| 2.0 | **1.3** | Git & GitHub |
| 2.1 | **1.4** | Components from mockups |
| 4.1 | **2.1** | Modelling the data |
| 2.3 | **2.2** | The API contract — OpenAPI |
| 3.1 | **2.3** | The stack, named |
| 3.2 | **2.4** | TypeScript in five ideas |
| 3.3 | *removed* | Arrays, objects, iteration — prior course |
| 3.4 | *removed* | Functions, modules, file layout — prior course |
| 3.5 | **2.5** | JSON, `fetch`, and `await` |
| 3.6 | *removed* | What React does for you — prior course |
| 3.7 | **2.6** | Choosing a library |
| 3.8 | **2.7** | Does it work? — Vitest |
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
| 5.3 | **4.6** | End-to-end testing |
| 5.5 | **4.7** | Deployment |
| 5.6 | **4.8** | Codebase assessment |

### The four moves that made it work

1. **Old 2.1 (components) moved into Module 1.** Building a screen with no data is the last
   step of designing it. It also stops students spending three weeks in YAML and SQL with
   nothing on screen.
2. **Old 4.1 (data modelling) moved to the head of Module 2**, ahead of the contract.
3. **The old Module 3 became the back half of Module 2**, minus its language lessons. Two of
   its three anchor files — `schema.d.ts` and `client.ts` — are produced by the contract.
4. **Old 5.4 (CI) moved up into week 8**, so the development phase is gated from its first
   pull request rather than its sixth.

---

## Every syllabus outcome still lands where it did

The syllabus week column reads as *"when this outcome is attained and assessed"*, the
framing the 8-week calendar already established. Under the new sequence that reading holds
without strain, because **nothing carrying an LO moved later.**

| CO | LOs | Attained | Assessed | Change |
|---|---|---|---|---|
| **CO1** | 1.1, 1.2 | W1–2, lessons 1.1–1.2 | A1 (W2), A2 (W3) | none |
| **CO2** | 2.1, 2.2 | **W3**, lesson 1.4 | A3 (W4) | **earlier** |
| **CO3** | 3.1, 3.2, 3.5, 3.7 | W5–6, lessons 2.3–2.6 | A5, A6 (W6) | none |
| **CO3** | 3.3, 3.4, 3.6 | **prior course**, verified W5 lab | week-5 diagnostic | **no longer lectured** |
| **CO4** | 4.1, 4.2 | 4.1 in **W4** (lesson 2.1); 4.2 in W7–8 | A7 (W7), A8 (W8) | LO 4.1 earlier |
| **CO5** | 5.1, 5.2, 5.3 | W13 and W15 clinics | A9 (W15), A10 (W16) | none |

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
| **Three of CO3's outcomes are no longer lectured.** LO 3.3, 3.4 and 3.6 are declared prior-course knowledge (2026-09-22), because the JavaScript and React lessons were removed. | The deck's *Assumed knowledge* slide and its CO3 coverage table both say so explicitly. **The week-5 lab diagnostic is the evidence and still has to be written** — without it those three LOs have no artifact. |
| **Contract-first is now argued rather than demonstrated.** The three-week gap is short enough that a group could skip the mock and wait for the backend. | Module 2's gate is running screens on the Prism mock. A group that waited has nothing to show at the week-6 gate. |
| **Week 4 carries both data modelling and the contract**, two dense inputs in one 2-hour block. | The normalisation stepper and the spec explorer are the instruments; the lab that week is the ERD-and-contract clinic, so modelling gets three lab hours immediately after. |
| **Module 4 is entirely clinics**, so a group behind on the backend has no time for it. | The sprint-2 gate is `contract:check`, not screens. Groups that are behind lose hardening time in sprint 4, which is the intended failure mode. |
| **The reference app's git history is in the old order.** | See `../reference-app/BUILD-PLAN.md`. Explain it in week 7 or rebase before week 1. |
