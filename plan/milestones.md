# The four milestones

**Decided 2026-09-22.** The course is sequenced as **four development milestones**, in the
order a group actually builds a system:

```
1 · UI/UX  →  2 · Contract  →  3 · Backend  →  4 · Frontend
   design       agree the       implement       consume it,
   the screen   shape of        the shape       validate, ship
                the data
```

Milestones are the student-facing spine. **Modules keep their numbers**, because module
numbers are course-outcome numbers in the OBE syllabus and an audit reads them. A module
is now a *body of material*; a milestone is *when it is delivered and what it produces*.
Several modules feed one milestone, and Module 2 feeds three.

---

## Why the order changed

The old sequence taught the frontend before the backend: Module 2 in weeks 3–5, Module 4
in weeks 7–8. That put two problems in the course.

**The contract was authored before anyone could model data.** Groups wrote
`openapi.yaml` in week 4 and did not learn schema modeling until Module 4. The old
`module-4/outline.md` said so out loud — *"expect breaking changes here, and say so in
advance."* Planned rework is still rework.

**The build order did not match the teach order.** Students were told to build a frontend
against a mock, then five weeks later build the thing the mock stood in for. That is a
real professional workflow, but it is a *second* workflow to learn, on top of the stack
itself, in a second-year course.

The new order fixes both. Data modeling now sits at the head of the Contract milestone —
you model what exists, then you write down how it is exposed, then you implement it, then
you consume it. Each milestone hands the next one an artifact it cannot proceed without.

**What it costs.** Contract-first loses some of its force. Under the old order the
frontend genuinely could not see a backend for five weeks, which made the argument for
itself. Now the gap is two weeks and the mock is a bridge rather than a way of life. The
argument has to be *made* in lesson 2.3 rather than demonstrated by the calendar. The
Prism mock stays — it is what lets Milestone 2 produce running screens — but its job is
now pedagogical, not logistical.

---

## The milestones

Each milestone has two lives: a **week it is taught** and a **sprint where the group
actually delivers it**. The gate is the second one, and it is always a demonstration.

| # | Milestone | Modules it draws on | Taught | Built | Gate |
|---|---|---|---|---|---|
| **1** | **UI/UX** | M1 (all) · M2.0 · M2.1 | W1–3 | W2–4 lab | A clickable static prototype of every screen, in the repo, passing the 8-point QA |
| **2** | **Contract** | M4.1 · M2.3 · M3 (all) | W4–6 | W4–6 lab | `openapi.yaml` v1 with a data model behind it, types generated, `contract:lint` clean |
| **3** | **Backend** | M4.2–4.7 · M5.4 | W7–8 | Sprints 1–2 (W10–13) | `contract:check` passes, and another group's account cannot read your rows |
| **4** | **Frontend** | M2.2 · M2.4 · M2.5 · M5.1–5.3 · M5.5 | Clinics W11–15 | Sprints 2–4 (W12–17) | The app runs on its own backend at a URL someone outside the group can open |

### 1 · UI/UX — weeks 1–3

Unchanged from the existing Module 1, plus the two Module 2 lessons that are really design
work: the repository the design lives in, and turning the mockup into components that have
no data in them yet.

| Lesson | From | What it adds |
|---|---|---|
| 1.1 Why interface design | M1 | — |
| 1.2 States, copy, the 8-point QA, the agentic build | M1 | — |
| 2.0 Git & GitHub — briefly | M2 | The repo the milestone is delivered into |
| 2.1 Components from mockups | M2 | **LO 2.1 and LO 2.2.** Static components, responsive, no data |

**Why 2.1 moved here.** Building a screen with no data in it is the last step of designing
it, not the first step of wiring it. Keeping it in week 3 also means students have
something on screen before they spend three weeks in YAML and SQL — the alternative was a
month between the prototype and the next visible thing.

**Gate:** A3, week 4. Every screen in the group's spec exists as a static, responsive
React component. No fetch calls. Every member has commits.

### 2 · Contract — weeks 4–6

The milestone that did not exist before. It was one lesson (2.3) buried in the middle of
the frontend module; it is now the hinge of the semester, and it absorbs Module 3 whole —
because Module 3's files *are* contract artifacts.

| Lesson | From | The file it opens |
|---|---|---|
| 4.1 Modeling the data | M4 | the group's own spec §6 |
| 2.3 The API contract — OpenAPI | M2 | `contract/openapi.yaml` |
| 3.1 The stack, named | M3 | `package.json` |
| 3.2 TypeScript in five ideas | M3 | `contract/generated/schema.d.ts` |
| 3.5 JSON, `fetch`, and `await` | M3 | `src/lib/api/client.ts` |
| 3.3 Arrays, objects, iteration | M3 | `SubjectCatalog.tsx` |
| 3.4 Functions, modules, where files live | M3 | `src/lib/`, `src/hooks/` |
| 3.6 What React does for you | M3 | `demos/subject-list-vanilla.html`, then the React twin |
| 3.7 Choosing a library | M3 | the dependency list, judged |
| 3.8 Does it work? — briefly | M3 | `src/lib/rules/units.test.ts` |

**Why Module 3 belongs here.** The tour was already built around three files —
`package.json`, `schema.d.ts`, and `client.ts`. Two of the three are produced *by* the
contract. Teaching generated types in the same fortnight they are generated turns 3.2 from
a TypeScript lesson into the answer to a question the students just asked.

**Read `client.ts`, don't build it.** Lesson 3.5 opens the typed client and explains what
the contract bought. Lesson 2.4 — *building* the wrapper, interception, server state — is
Milestone 4. Reading a finished thing and writing one are different sessions and they are
now in different milestones.

**Gate:** A4 (W5), A5 and A6 (W6). The contract lints clean, the types regenerate with no
diff, and the first unit tests pass.

### 3 · Backend — weeks 7–8, built in sprints 1–2

Module 4 minus its first lesson, which moved forward. The module is otherwise intact, and
it gains CI — because the dev phase needs a merge gate from its first day, and everything
CI runs now exists.

| Lesson | From | Note |
|---|---|---|
| 4.2 Migrations | M4 | Now three weeks after the model was drawn, not the same hour |
| 4.3 CRUD endpoints over the schema | M4 | — |
| 4.4 Row Level Security — briefly | M4 | The most important uncovered topic |
| 4.5 Constraints and triggers — briefly | M4 | — |
| 4.6 Edge Functions — briefly | M4 | — |
| 4.7 Implementing the contract | M4 | The acceptance criterion, now two weeks after the contract rather than five |
| 5.4 CI — briefly | M5 | **Moved up from a week-13 clinic.** `test` and `contract:check` both exist by week 8 |

**Gate:** sprint 1 (W10–11) — another group's account cannot read your rows, demonstrated
against a live database. Sprint 2 (W12–13) — `contract:check` passes and CI is green and
required before merge.

### 4 · Frontend — clinics in weeks 11–15, built in sprints 2–4

The rest of Module 2 and almost all of Module 5, taught as ~45–60 minute clinics in the
week each one is applied. This is the same exception the calendar already made for
deployment and e2e, extended to the wiring lessons for the same reason: teaching students
to consume an API eight weeks before they have one to consume guarantees it is re-taught.

| Wk | Clinic | From | ~min |
|---|---|---|---|
| 11 | 2.2 Auth Context + route protection | M2 | 45 |
| 12 | 2.4 API wrapper, interception, server state · 2.5 Data states in practice | M2 | 60 |
| 13 | 5.1 Two-layer validation · 5.2 Integration day | M5 | 60 |
| 14 | 5.3 End-to-end testing — briefly | M5 | 45 |
| 15 | 5.5 Deployment | M5 | 45 |

**Integration day is no longer a cliff.** Under the old order, week 13 was the first time
the frontend met the backend and the failure surface was the whole app. Now the screens
are wired to a real backend from sprint 2, one at a time, and 5.2 is the session that
explains what the contract bounded — with the evidence already on their screens.

**Gate:** sprint 3 (W14–15) — A9, the app reachable at a URL by someone not in the group.
Sprint 4 (W16–17) — A10, the Codebase Assessment, and the Final Web Project.

---

## Every syllabus outcome still lands where it did

The syllabus week column reads as *"when this outcome is attained and assessed"*, the
framing the 8-week calendar already established. Under the new sequence that reading holds
without strain, because **nothing carrying an LO moved later.**

| CO | LOs | Attained | Assessed | Change |
|---|---|---|---|---|
| **CO1** | 1.1, 1.2 | W1–2 | A1 (W2), A2 (W3) | none |
| **CO2** | 2.1, 2.2 | **W3**, lesson 2.1 | A3 (W4) | **earlier** |
| **CO3** | 3.1–3.7 | W5–6 | A5, A6 (W6) | none |
| **CO4** | 4.1, 4.2 | 4.1 in **W4**, 4.2 in W7–8 | A7 (W7), A8 (W8) | 4.1 earlier |
| **CO5** | 5.1, 5.2, 5.3 | W13, W15 clinics | A9 (W15), A10 (W16) | none |

### The one retag this required

LO 2.2 — *cross-device responsiveness* — was tagged on lesson **2.5 Data states in
practice**, which is now a week-12 clinic. It is retagged onto **2.1 Components from
mockups**, in week 3.

This is the more honest placement regardless of the resequencing. Responsiveness is
attained when a component is built with Tailwind breakpoints that work, which is 2.1's
whole exercise. What 2.5 added was *real latency*, which is a data-states concern, not a
responsiveness one. After the retag, 2.5 carries no LO, which is what it always was.

Everything else that moved into the dev phase — 2.2, 2.4, 2.5 — carries no syllabus LO.
2.2 was tagged LO 2.1, which lesson 2.1 attains on its own in week 3.

**Nothing else moved.** All ten activities keep their existing weeks. Both examinations,
the orientation week, and the contact-hour split are untouched.

---

## What this changes in the repository

| File | Change |
|---|---|
| `plan/semester-calendar.md` | Week grid rebuilt around the milestones; clinic list extended |
| `plan/index.html` | Milestone banners; 2.1 retagged LO 2.1 + LO 2.2; 2.5 retagged No LO |
| `module-N/module.json` | New `milestone` and `taught` fields |
| `module-N/outline.md` | Milestone banner at the head of each |
| `index.html` | Landing page groups the decks by milestone |
| `reference-app/BUILD-PLAN.md` | "Explained in" column follows the milestones |

**The decks themselves are not re-cut.** Module 2's slides stay in Module 2 even though
its lessons are delivered across three milestones. Splitting a built 51-slide deck to
match the delivery order would cost more than it returns, and the deck is navigated by
lesson anyway. What changes is *when you open it and which section you run.*

---

## Known risks

| Risk | Mitigation |
|---|---|
| **Module 2 is delivered in three pieces across fifteen weeks.** The deck is one artifact; the delivery is not. | Each milestone's outline names the exact lessons it runs. The deck's own section navigation is the aid — you open Module 2 three times and run one section each time. |
| **Contract-first is now argued rather than demonstrated.** The two-week gap is short enough that a group could skip the mock and wait for the backend. | Milestone 2's gate is running screens on the Prism mock. A group that waited has nothing to show at the week-6 gate. |
| **Week 4 carries both data modeling and the contract**, two dense inputs in one 2-hour block. | 4.1's normalisation stepper is the interactive instrument; the lab that week is the ERD-and-contract clinic, so the modeling gets three lab hours immediately after. |
| **Frontend wiring is compressed into sprints 2–3** with clinics rather than lectures. A group that is behind on the backend has no time for it. | The sprint-2 gate is `contract:check`, not screens. Groups that are behind lose hardening time in sprint 4, which is the intended failure mode. |
| **The reference app's git history is in the old order** — the wiring commits land before the backend. | See `reference-app/BUILD-PLAN.md`. The history is build order, not milestone order, and the calendar carries the narrative instead. |
