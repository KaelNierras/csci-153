# Semester calendar — 8 weeks of lecture, 8 weeks of build

**Decided 2026-08-19, resequenced 2026-09-22.** All five modules are lectured in
**weeks 1–8**. Weeks **10–17** carry no new lectures except five short clinics: they are
supervised development of the Final Web Project, run as four two-week sprints.

Since 2026-09-22 the course is sequenced as **four milestones** — UI/UX, Contract,
Backend, Frontend — in the order a group actually builds a system. The milestones are the
spine; the modules are the material they draw on. `milestones.md` is the authoritative
document for that structure and the OBE argument behind it. This file is the week grid.

---

## What is fixed, and what is not

The OBE syllabus fixes three things that cannot move:

| Week | Fixed |
|---|---|
| 1 | Class orientation |
| 9 | **Midterm examination** |
| 18 | **Final examination** |

It also fixes the contact hours — **2 hours lecture + 3 hours laboratory per week** — and
the assessment set: 10 Activities (30%), one Codebase Assessment (20%), the Final Web
Project (50%).

What is *not* fixed is the week column against each module. Reading it as **"when this
outcome is attained and assessed"** rather than "when it is lectured" is what makes this
restructure defensible: every LO, every activity, and both examinations stay exactly where
the syllabus puts them. Only the lecture input moves — and under the milestone sequence,
**nothing carrying an LO moves later.** CO2 and the first half of CO4 move *earlier*. The
full outcome-by-outcome table is in `milestones.md`.

### The arithmetic

| | Before | After |
|---|---|---|
| Lecture input | 15 weeks, spread thin | **8 weeks, 16 lecture hours** |
| Supervised build | folded into modules 4–5 | **8 weeks, 40 contact hours** |
| Weeks with new material | 15 | 8, plus five clinics |

---

## The compression

| Module | Was | Now lectured | Milestone it serves |
|---|---|---|---|
| **1 · UI/UX** | 2–3 | **1–2** | 1 |
| **2 · Frontend** | 3–5 | **split: W3, W4, clinics W11–12** | 1 (2.0, 2.1) · 2 (2.3) · 4 (2.2, 2.4, 2.5) |
| **3 · The Stack** | 5–8 | **5–6** | 2 |
| **4 · Backend** | 10–12 | **W4 (4.1), W7–8 (4.2–4.7)** | 2 (4.1) · 3 (the rest) |
| **5 · Integration** | 13–17 | **W8 (5.4), clinics W13–15** | 3 (5.4) · 4 (the rest) |

**Module 2 is delivered in three pieces**, which is the one genuinely awkward consequence
of the resequencing. The deck is not split — you open it three times and run one section
each time. Which lessons belong to which milestone is in `milestones.md` and repeated at
the head of `module-2/outline.md`.

---

## Weeks 1–8 · lecture

Two hours of lecture, three of laboratory. The lab column is where the activities are
actually done, with you in the room.

| Wk | Milestone | Lecture (2h) | Laboratory (3h) | Due |
|---|---|---|---|---|
| **1** | **1 · UI/UX** | Orientation · M1.1 Why interface design | **Groups form, systems assigned.** Figma, tokens | — |
| **2** | 1 | M1.2 States, copy, the 8-point QA, the agentic build | Activity 1 clinic | **A1** UI audit *(individual)* |
| **3** | 1 | M2.0 Git & GitHub · M2.1 Components from mockups | Repo, branches, first PRs | **A2** Brief → prototype |
| **4** | **2 · Contract** | M4.1 Modeling the data · M2.3 The API contract (OpenAPI) | ERD and contract authoring clinic | **A3** Prototype → components *(individual)* · **M1 gate** |
| **5** | 2 | M3.1 The stack, named · M3.2 TypeScript in five ideas · M3.5 JSON, `fetch`, `await` | Generate the types; screens on the Prism mock | **A4** The contract *(group)* |
| **6** | 2 | M3.3 Iteration · M3.4 Modules and file layout · M3.6 What React does for you · M3.7 Choosing a library · M3.8 Vitest | Code reading · first unit tests | **A5** `package.json` accounting · **A6** First unit tests · **M2 gate** |
| **7** | **3 · Backend** | M4.2 Migrations · M4.3 CRUD over the schema · M4.4 Row Level Security | Migration clinic on the group's own model | **A7** Schema + migrations |
| **8** | 3 | M4.5 Constraints & triggers · M4.6 Edge Functions · M4.7 Implementing the contract · M5.4 CI | Sprint 1 planning: issues, milestones, board, CI wired | **A8** RLS policies |
| **9** | — | **MIDTERM EXAMINATION** — covers all five modules | | |

**Week 4 is the hinge.** Two dense inputs in one block: the data model and the contract
that exposes it. The normalisation stepper (4.1) and the spec explorer (2.3) are both
interactive, and the three lab hours that afternoon are the ERD-and-contract clinic — so
the modeling is applied within the hour it is taught, on the group's own system.

**Week 6 and week 8 are the dense ones.** Five short inputs each, one live demonstration
apiece and no exercises. The demonstrations are already chosen: the DOM operation counter
(3.6), the test ceiling broken on purpose (3.8), the anon key reading another user's row
(4.4), and the `VITE_` secret found in the bundle (4.6).

### The five clinics

Five topics are **not** taught in weeks 1–8. They are taught in the week they are applied,
as one input and one demo, straight into using it that afternoon.

| Wk | Clinic | Milestone | ~min | Why not week 8 |
|---|---|---|---|---|
| **11** | M2.2 Auth Context + route protection | 4 | 45 | Needs a real session to protect a route with |
| **12** | M2.4 API wrapper & server state · M2.5 Data states | 4 | 60 | Needs endpoints to wrap and latency to show |
| **13** | M5.1 Two-layer validation · M5.2 Integration day | 4 | 60 | Needs both layers to exist before you can bypass one |
| **14** | M5.3 End-to-end testing | 4 | 45 | Needs a working app to drive |
| **15** | M5.5 Deployment | 4 | 45 | Teaching deployment seven weeks before anyone deploys guarantees it is forgotten |

**M5.4 CI moved the other way** — out of the clinics and into week 8. CI runs `lint`,
`typecheck`, `test` and `contract:check`, and all four exist by week 8. Wiring it at the
start of the dev phase rather than in week 13 means every sprint is gated from its first
pull request instead of its sixth.

---

## Weeks 10–17 · development

Four two-week sprints. No new material except the five clinics.

| Sprint | Wks | Milestone | Goal | Gate at the end |
|---|---|---|---|---|
| **1** | 10–11 | **3** | Schema, migrations, and RLS for the group's own system. Contract v2 versioned where week-4 decisions were wrong. *Clinic: auth context (11)* | Another group's account cannot read your rows. Demonstrated, not claimed |
| **2** | 12–13 | 3 → **4** | CRUD endpoints and Edge Functions. First screens wired to the real backend. *Clinics: wrapper & server state (12), validation & integration (13)* | `contract:check` passes. CI is green and required before merge |
| **3** | 14–15 | 4 | Remaining screens, validation on both layers, staging deployment. *Clinics: e2e (14), deployment (15)* | The app is reachable at a URL by someone not in the group. **A9** |
| **4** | 16–17 | 4 | Hardening, test-cases-as-issues cleared, 12-point QA on every screen | **A10** · Codebase Assessment · Final Web Project + demos |

**Integration is now incremental.** Under the old order the frontend met the backend for
the first time in week 13 and the failure surface was the whole application. Now screens
are wired one at a time from sprint 2, and M5.2 Integration Day is the session that
*explains* what the contract bounded — with the evidence already on their own screens.

### The weekly ritual

Same shape every week, so nobody has to be told it:

1. **15 minutes, per group, at the start of lab.** Board on screen. What moved, what is
   blocked, what is next. A board that does not match reality is the finding.
2. **You review open PRs live** for one group per week, rotating. Reviewing in front of
   everyone teaches review faster than any lecture on it.
3. **Every member commits every week.** This is checkable and it is the evidence of
   individual contribution inside a group grade.
4. **Blocked more than 48 hours is an escalation**, not a private struggle.

### Week 18

Final examination. With everything lectured by week 8 and the project submitted in week
17, this is a comprehensive paper — and by then every topic has been *used*, not just
heard, which is the best possible condition for it.

---

## Where the assessments land

Unchanged by the resequencing. All ten activities keep their original weeks.

| Assessment | Weight | When | Milestone |
|---|---|---|---|
| A1 UI audit *(individual)* | 3% | W2 | 1 |
| A2 Brief → prototype | 3% | W3 | 1 |
| A3 Prototype → components *(individual)* | 3% | W4 | 1 — **gate** |
| A4 The contract *(group)* | 3% | W5 | 2 |
| A5 `package.json` accounting | 3% | W6 | 2 |
| A6 First unit tests | 3% | W6 | 2 — **gate** |
| A7 Schema + migrations | 3% | W7 | 3 |
| A8 RLS policies | 3% | W8 | 3 |
| A9 Deployed staging build | 3% | W15 | 4 — **gate** |
| A10 E2E tests from issues | 3% | W16 | 4 |
| **Codebase Assessment** | **20%** | W16–17 | — |
| **Final Web Project** | **50%** | W17, demos W17–18 | — |

Activities 5–10 do not exist yet — only A1–A4 are written. **A5–A8 are needed by week 6**,
which is the tightest deadline this restructure creates.

---

## What this costs

| Risk | Mitigation |
|---|---|
| **No slack.** One suspended week — and the syllabus names force majeure explicitly — and the lecture block breaks. | The week 6 and week 8 labs are the designated catch-up capacity. Beyond that, overflow goes into sprint 1 and sprint 4 loses hardening time, in that order. |
| **Groups must form in week 1**, not before week 3. Activity 2 designs a screen of the system the group will ship. | Assign systems in the orientation session. It is a five-minute decision that unblocks four weeks. |
| **Module 2 is delivered in three pieces across fifteen weeks.** | Each milestone's section of `milestones.md` names the exact lessons it runs, and `module-2/outline.md` repeats the split at its head. |
| **Contract-first is argued, not demonstrated.** The backend is now two weeks behind the contract, not five, so a group could skip the mock and wait. | The Milestone 2 gate is running screens on the Prism mock. A group that waited has nothing to show in week 6. |
| **A 2–3 week gap** between learning schema/RLS (W7–8) and applying it (W10–11). | The midterm in week 9 sits in that gap and is the recall event. Sprint 1's gate is a demonstration, not a claim, so nobody can defer understanding. |
| **Front-loaded cognitive load.** Five modules in eight weeks is genuinely hard on a second-year cohort. | The lab hour every week is applied practice on their own system, not exercises. The milestone sequence helps here: every week's lab feeds the same artifact rather than a new one. |
| **Students who fall behind in weeks 1–8 cannot catch up by attending.** There is no re-teaching week. | The activity cadence is weekly and each one is small: a missed activity is visible within seven days, not at midterm. |

---

## Knock-on changes

- [x] `plan/milestones.md` — the milestone spine and the OBE argument
- [x] `module-N/outline.md` milestone banners and week headers
- [x] `module-N/module.json` — `milestone` and `taught` fields
- [x] `plan/index.html` — milestone banners; LO 2.2 retagged from lesson 2.5 to lesson 2.1
- [x] `index.html` landing page — decks grouped by milestone
- [x] `reference-app/BUILD-PLAN.md` — rewritten against the app as actually built
- [ ] **Activities 5–10 need writing** — A5–A8 by week 6
- [x] Assessment weights reconciled with the syllabus table — 3% per activity, Codebase
      Assessment 20%, Final Web Project 50%
- [ ] The published Semester Plan artifact still shows the old 15-week spread
