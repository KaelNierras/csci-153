# Semester calendar — 8 weeks of lecture, 8 weeks of build

**Decided 2026-08-19.** All five modules are lectured in **weeks 1–8**. Weeks **10–17**
carry no new lectures: they are supervised development of the Final Web Project, run as
four two-week sprints.

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
restructure defensible: every LO, every activity, and both examinations stay exactly
where the syllabus puts them. Only the lecture input moves earlier.

### The arithmetic

| | Before | After |
|---|---|---|
| Lecture input | 15 weeks, spread thin | **8 weeks, 16 lecture hours** |
| Supervised build | folded into modules 4–5 | **8 weeks, 40 contact hours** |
| Weeks with new material | 15 | 8 |

The gain is real: the project currently gets whatever time is left over inside Modules 4
and 5. After this change it gets **40 supervised hours with the instructor in the room**,
which is where a group project actually succeeds or fails.

---

## The compression

| Module | Was | Now | What absorbs it |
|---|---|---|---|
| **1 · UI/UX** | 2–3 | **1–2** | Orientation shares week 1; both lessons already fit two weeks |
| **2 · Frontend** | 3–5 | **3–5** | Unchanged. It is the load-bearing module — the contract is written here |
| **3 · The Stack** | 5–8 | **5–6** | Biggest cut: 4 weeks → 1.5. Survives because it is now a *tour* of a codebase, and reading is lab work, not lecture |
| **4 · Backend** | 10–12 | **7–8** | Lecture only. The implementation work moves to sprints 1–2 |
| **5 · Integration** | 13–17 | **8 + clinics** | It was always "mostly supervised build time with short inputs." The inputs stay; the build time becomes the dev phase |

**Module 3 takes the deepest cut and is the one to watch.** It works only because the
module was already restructured from four weeks of JavaScript teaching into a guided tour
of the reference app: the lecture hours name the stack and demonstrate two things live
(`await`, and the DOM by hand), while the reading of actual files happens in lab and as
self-study. If it turns out to be too thin, the honest fix is to take a week back from
the dev phase — not to re-expand it and lose a sprint.

---

## Weeks 1–8 · lecture

Two hours of lecture, three of laboratory. The lab column is where the activities are
actually done, with you in the room.

| Wk | Lecture (2h) | Laboratory (3h) | Due |
|---|---|---|---|
| **1** | Orientation · M1.1 Why interface design | **Groups form, systems assigned.** Figma, tokens | — |
| **2** | M1.2 States, copy, the 8-point QA, agentic build | Activity 1 clinic | **A1** UI audit *(individual)* |
| **3** | M2.0 Git & GitHub · M2.1 Components | Repo, branches, first PRs | **A2** Brief → prototype |
| **4** | M2.2 Auth Context · M2.3 The API contract | Contract authoring clinic | **A3** Prototype → components |
| **5** | M2.4 Wrapper & server state · M2.5 Data states · M3.1 The stack, named | Screens on the Prism mock | **A4** The contract *(group)* |
| **6** | M3.2–3.7 The tour: TypeScript, iteration, modules, JSON/`await`, React-as-DOM, choosing a library | Code reading · M3.8 Vitest | **A5** `package.json` accounting · **A6** First unit tests |
| **7** | M4.1 Schema modeling · M4.2 Migrations · M4.3 CRUD endpoints | Schema modeling clinic on the group's own spec | **A7** Schema + migrations |
| **8** | M4.4 RLS · M4.5 Constraints & triggers · M4.6 Edge Functions · M5.1 Two-layer validation · M5.2 Integration day | Sprint 1 planning: issues, milestones, board | **A8** RLS policies |
| **9** | **MIDTERM EXAMINATION** — now covers all five modules | | |

Week 8 is the densest hour of the semester and should be treated as such: five short
inputs, each with one live demonstration and no exercises. The demonstrations are already
chosen — the anon key reading another user's row (4.4), the `VITE_` secret found in the
bundle (4.6), and the REST client posting a payload the form would have rejected (5.1).

### The three clinics — a deliberate exception

Three Module 5 topics are **not** taught in weeks 1–8:

| Topic | Taught in | Why not week 8 |
|---|---|---|
| M5.3 End-to-end testing | **Week 12**, ~45 min | Needs a working backend to test against |
| M5.4 CI | **Week 13**, ~45 min | Needs tests to run |
| M5.5 Deployment | **Week 15**, ~45 min | Teaching deployment eight weeks before anyone deploys guarantees it is forgotten |

These are clinics, not lectures: one input, one demo, straight into applying it that
afternoon. If "no lectures after week 8" needs to be literal, they can be compressed into
week 8 — but they will have to be re-taught in the dev phase anyway, so it costs time
rather than saving it.

---

## Weeks 10–17 · development

Four two-week sprints. No new material except the three clinics.

| Sprint | Wks | Goal | Gate at the end |
|---|---|---|---|
| **1** | 10–11 | Schema, migrations, and RLS for the group's own system. Contract v2 versioned where week-5 decisions were wrong | Another group's account cannot read your rows. Demonstrated, not claimed |
| **2** | 12–13 | CRUD endpoints and Edge Functions. First screens on the real backend. *Clinics: e2e (12), CI (13)* | `contract:check` passes. CI is green and required before merge |
| **3** | 14–15 | Remaining screens, validation on both layers, staging deployment. *Clinic: deployment (15)* | The app is reachable at a URL by someone not in the group. **A9** |
| **4** | 16–17 | Hardening, test-cases-as-issues cleared, 12-point QA on every screen | **A10** · Codebase Assessment · Final Web Project + demos |

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

| Assessment | Weight | When |
|---|---|---|
| A1 UI audit *(individual)* | 3% | W2 |
| A2 Brief → prototype | 3% | W3 |
| A3 Prototype → components *(individual)* | 3% | W4 |
| A4 The contract *(group)* | 3% | W5 |
| A5 `package.json` accounting | 3% | W6 |
| A6 First unit tests | 3% | W6 |
| A7 Schema + migrations | 3% | W7 |
| A8 RLS policies | 3% | W8 |
| A9 Deployed staging build | 3% | W15 |
| A10 E2E tests from issues | 3% | W16 |
| **Codebase Assessment** | **20%** | W16–17 |
| **Final Web Project** | **50%** | W17, demos W17–18 |

Activities 5–10 do not exist yet — only A1–A4 are written. **A5–A8 are needed by week 6**,
which is the tightest deadline this restructure creates.

---

## What this costs

| Risk | Mitigation |
|---|---|
| **No slack.** One suspended week — and the syllabus names force majeure explicitly — and the lecture block breaks. | The week 6 and week 8 labs are the designated catch-up capacity. Beyond that, overflow goes into sprint 1 and sprint 4 loses hardening time, in that order. |
| **Groups must form in week 1**, not before week 3. Activity 2 designs a screen of the system the group will ship. | Assign systems in the orientation session. It is a five-minute decision that unblocks four weeks. |
| **A 2–3 week gap** between learning schema/RLS (W7–8) and applying it (W10–11). | The midterm in week 9 sits in that gap and is the recall event. Sprint 1's gate is a demonstration, not a claim, so nobody can defer understanding. |
| **The reference app must be finished by week 7**, not week 13. Its build plan assumed one phase ahead of a 17-week schedule. | See the revised phases in `../reference-app/BUILD-PLAN.md`. The app now gets built before the semester and in weeks 1–5. |
| **Front-loaded cognitive load.** Five modules in eight weeks is genuinely hard on a second-year cohort. | The lab hour every week is applied practice on their own system, not exercises. Nothing is learned and then parked — except the M4 material, which is what the midterm is for. |
| **Students who fall behind in weeks 1–8 cannot catch up by attending.** There is no re-teaching week. | The activity cadence is weekly and each one is small: a missed activity is visible within seven days, not at midterm. |

---

## Knock-on changes

- [x] `module-N/outline.md` week headers and `module-N/module.json`
- [x] `plan/index.html` week markers
- [x] The "you are here" table in the Module 1 and Module 2 decks
- [x] `reference-app/BUILD-PLAN.md` phase timing
- [ ] **Activities 5–10 need writing** — A5–A8 by week 6
- [x] Assessment weights reconciled with the syllabus table — 3% per activity, Codebase
      Assessment 20%, Final Web Project 50% — across both decks and all four lab briefs.
      The decks previously showed a Practical Exam (15%) and Term Examinations (24%), which
      are not in Revision 3. "CA" now means Codebase Assessment everywhere; the activities
      are A1–A10
- [ ] The published Semester Plan artifact still shows the old 15-week spread
