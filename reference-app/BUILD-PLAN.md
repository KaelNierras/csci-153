# Build plan — Enroll, the CSci 153 reference app

Companion to `PROJECT-CONTEXT.md`. That file says *what* the app is; this one says
*when each part gets built, which lesson it serves, and what you demo from it.*

**Principle:** the app is built in the same order the modules teach, one phase ahead of
the class. Never further ahead than that. An app that is already finished cannot
demonstrate a decision being made — and the decisions are the lesson.

> **Revised 2026-08-19 for the 8-week lecture calendar** (`../plan/semester-calendar.md`).
> All five modules are lectured in weeks 1–8, so the app must be **complete by week 7** —
> six weeks earlier than originally planned. That changes the shape of this plan in two
> ways:
>
> 1. **Phase 0 grows.** More has to exist before week 1, because there is no longer a
>    four-week Module 3 to build during.
> 2. **"One phase ahead" survives for Modules 1–2 only.** Weeks 3–5 can still be
>    demonstrated as live decisions. Modules 4 and 5 are lectured in weeks 7–8, which
>    means their code is written in weeks 5–6 — one week ahead, not one phase.
>
> What you lose is the *live* build for the backend half. What replaces it is better
> suited to the compressed calendar anyway: you demo the **git history** of decisions
> already made, and the live decision-making moves to the sprint clinics in weeks 10–17,
> where the students are the ones making them.

## The shape of it

| Phase | Do it | Ships | Serves |
|---|---|---|---|
| **0 · Skeleton** | before week 1 | repo, tokens, one screen, mock, all 9 operations drafted offline | Module 1–2 opening |
| **1 · Contract & frontend** | weeks 1–4, one lesson ahead | 6 screens on the Prism mock | Module 2 (weeks 3–5) |
| **2 · Specimens** | week 5 | Vitest tests, the vanilla-DOM twin, annotated `package.json` | Module 3 (weeks 5–6) |
| **3 · Backend** | weeks 5–6 | Supabase, RLS, Edge Function, contract v2 | Module 4 (weeks 7–8) |
| **4 · Integration** | weeks 6–7 | real base URL, Playwright, CI, deployed | Module 5 (week 8 + clinics) |
| **5 · Reference only** | weeks 10–17 | no new code; the app is the thing groups compare against | the dev phase |

Total instructor build effort is unchanged at roughly **30–40 hours** — but it is now
compressed into the pre-semester break and weeks 1–7, which is about **5 hours a week on
top of teaching**. That is the real cost of this calendar, and it is worth naming before
committing to it.

**If that is not survivable,** the honest fallback is to build Phases 0–2 properly and
teach Modules 4–5 from migrations, policies, and a workflow file written on the projector
rather than from a finished app. The backend half of Enroll then gets built during the dev
phase alongside the groups — which has its own teaching value, since they watch you hit
the same problems they are hitting.

## Phase 0 · Skeleton — before week 1

The smallest thing that runs, so week 1 opens on a working app rather than an empty
editor. Bigger than it was: the compressed calendar has no spare weeks to build in later.

- [ ] `reference-app/` repo, public on GitHub, README pointing at `PROJECT-CONTEXT.md`
- [ ] Vite + React + TS + Tailwind, `tokens.css` from Module 1's token set
- [ ] shadcn/ui initialised, theme wired to the tokens
- [ ] `contract/openapi.yaml` — **`listSubjects` only**, deliberately incomplete
- [ ] Prism serving the mock, one screen listing subjects against it
- [ ] Vitest and Playwright installed but with no tests. Students should see the empty
      folders in Module 3 and 5 and know they were always part of the plan.

**Demo value:** the "Where this sits" slide stops being a diagram. You show one screen
fetching from a contract that has one operation, then say *"by week 5 this file has nine,
and the group that writes it decides what the backend has to do."*

---

## Phase 1 · Contract & frontend — weeks 1–4

The heaviest phase, and the only one that still gets to run a lesson ahead of the class.
Build in this order, because it is the order the deck argues for. Module 2 is lectured in
weeks 3–5, so this phase runs one week in front of it.

| Lesson | Build | Demo in class |
|---|---|---|
| 2.0 Git | the repo's first week of real history | Open the actual commit graph. Your own branches, your own PR with one approval, one conflict you caused on purpose. The deck's commit-graph widget is the model; this is the real thing. |
| 2.1 Components | `SubjectRow`, `UnitMeter`, `EnrollmentTable`, `EmptyState`, `ErrorState` | The `git log` where `SubjectList.tsx` got split. Show the commit where a boolean prop became `children`. |
| 2.2 Auth Context | `SessionContext`, `useSession`, `RequireRole`, `/login` | Sign in as a student, then as an adviser; then delete the guard in devtools and land on `/advising` anyway. That is the RLS setup for Module 4. |
| 2.3 Contract | all 9 operations, error responses, `components.schemas`, Redoc published | Write operation 9 **live**, from an argument about a field name. Then `redocly lint` failing, then passing. |
| 2.4 Wrapper | `lib/api/client.ts`, TanStack Query on every screen | Devtools network tab: two screens, one request. Then approve an enrollment and watch the queue key invalidate. |
| 2.5 Data states | skeletons, the three empties, error + retry, 320px pass | Prism's `--errors` flag and Slow 3G throttling, live. Every state on the projector without touching code. |

**Guardrails for this phase**

- Nine operations, no more. Every one you add is one more thing to keep in sync in sprint 1.
- Build the failures first on at least one screen: 409, 422, empty, offline. It reverses
  the habit students arrive with.
- Commit messages are lesson material. `feat(enrollment): add unit meter with ceiling
  warning` is the example on the slide; make sure the real log looks like the slide.

---

## Phase 2 · Specimens — week 5

Module 3 is a tour, so the app must stop moving. Freeze features; the only additions are
the three specimens the tour needs. One week, because Module 3 is now one and a half.

- [ ] `lib/rules/units.ts` — pure functions for R2, R3, R4, with the tests written after
      the class watches the first one fail
- [ ] `demos/subject-list-vanilla.html` — the same subject list in `createElement` and
      `addEventListener`, for lesson 3.6
- [ ] A one-page annotated `package.json` for lesson 3.1: every dependency, one sentence,
      "what breaks if I remove this?"

**Demo value:** every session opens a real file from a running app. That is the whole
reason the module was restructured — students stop learning syntax in the abstract and
start reading a codebase, which is the actual professional skill.

---

## Phase 3 · Backend — weeks 5–6

Build during weeks 5–6, one week ahead of the Module 4 lectures in weeks 7–8. This is the
tightest window in the plan and the first thing to protect.

- [ ] `supabase/migrations/` — the schema behind the contract's shapes
- [ ] RLS policies for R7 and R8, then **demonstrate the bypass being blocked**: sign in
      as student A, request student B's enrollment, get nothing back. Same request the
      deleted route guard let through in week 4 — a three-week callback, tight enough that
      the class still remembers it.
- [ ] Constraints + a trigger for R2, so the unit ceiling is enforced where it counts
- [ ] An Edge Function for `submitEnrollment`, because it is a multi-table transaction
- [ ] `supabase gen types typescript` — the second instance of "schema is truth, types
      are downstream"
- [ ] **Contract v2.** Expect the week-5 spec to need breaking changes now that real
      modeling has been done. Version it properly: `feat(contract)!: …`, a note saying
      who has to change what, and keep v1 in the history.

**Demo value:** the v1 → v2 diff is the best slide in Module 4 and you cannot fake it.
Do not tidy the week-5 contract to look prescient — the drift is the lesson, and the groups
are about to live it in sprint 1.

---

## Phase 4 · Integration — weeks 6–7

- [ ] Swap Prism for Supabase by changing **one environment variable**. Do this live. It
      is the payoff for the entire contract-first argument, and it takes ten seconds.
- [ ] Validation pass on every form, error shape end to end
- [ ] Playwright: the enrollment happy path, plus the R2 ceiling and the R7 forbidden
      case — **run as an authenticated role so RLS is exercised, not bypassed**
- [ ] GitHub Actions: lint, contract lint, stale-generated-types check, unit, e2e
- [ ] Deploy the frontend, point it at hosted Supabase, put the URL in the README
- [ ] Break something on purpose and let CI catch it in front of the class

---

## Phase 5 · Reference only — weeks 10–17

**Write no new features.** From week 10 the app's job changes: it is the thing groups
compare their own repo against, and the answer key you open when three groups are stuck on
the same problem.

- Keep a short `DEMOS.md` — the five demonstrations worth re-running on request (the anon
  key, the `VITE_` secret in the bundle, the base-URL swap, a red CI run, the v1→v2 diff)
- Fix bugs students find. Credit them by name in the commit; it is the cheapest possible
  lesson in what a good bug report is worth
- **Resist adding features to match what a group built.** The ceiling in
  `PROJECT-CONTEXT.md` §1 does not lift because a group got ambitious

---

## Risks, and what to do about them

| Risk | Mitigation |
|---|---|
| **Scope creep.** The app quietly grows into something impressive and unreadable. | The ceiling in `PROJECT-CONTEXT.md` §1 is a hard limit: 9 operations, 6 screens, 2 roles. Cut, do not extend. |
| **Building too far ahead.** A finished app cannot demo a decision. | Still one phase ahead where it is possible — Phases 0–2. For Modules 4–5 it is one *week* ahead, and the live decision-making moves to the sprint clinics. |
| **The compressed build is 5 hours a week on top of teaching for seven weeks.** | Named at the top of this file, with a stated fallback: build Phases 0–2 properly and teach Modules 4–5 from files written on the projector. |
| **The demo drifts from the deck.** | Both live in git. When a slide changes, check the app; when the app changes, check the slide. The 12-point QA is the shared checklist. |
| **Students copy it wholesale.** | Different domain from all three project systems, and every rubric grades *justification*, not output. A boundary you cannot defend out loud at the Practical Exam scores nothing. |
| **You run out of time mid-semester.** | Phases 0–1 are the ones that must exist. If Phase 3 slips, teach Module 4 from migrations and policies alone and catch the app up during sprint 1. Phase 2 can be cut to just `units.ts`. |

---

## Start here

Before week 1, in order:

1. Create the repo and commit `PROJECT-CONTEXT.md` as the first commit — so the context
   file is older than the code, which is the point being taught.
2. Phase 0 checklist above. Budget a full day now that it carries more.
3. Draft `contract/openapi.yaml` with all nine operations *offline*, but commit only
   `listSubjects`. Holding the rest back is what makes lesson 2.3 a live exercise rather
   than a reveal.
4. Block out the Phase 3 window (weeks 5–6) in your own calendar **before the semester
   starts**. It is the phase that gets squeezed, and it is the one carrying RLS — the most
   important uncovered topic in the course.
