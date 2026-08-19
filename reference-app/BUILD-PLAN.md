# Build plan — Enroll, the CSci 153 reference app

Companion to `PROJECT-CONTEXT.md`. That file says *what* the app is; this one says
*when each part gets built, which lesson it serves, and what you demo from it.*

**Principle:** the app is **finished before the semester starts**, and lectures explain it
rather than build it. No live coding during discussion — you open a real file from a real
running app, and talk about why it is the way it is.

> **Revised 2026-08-19.** Two decisions changed the shape of this plan on the same day:
> lectures compress into weeks 1–8 (`../plan/semester-calendar.md`), and **discussion
> sessions are explanation, not live coding.**
>
> The earlier version of this plan built the app one phase ahead of the class so decisions
> could be made live on the projector. That is now explicitly not the teaching method, and
> dropping it removes the worst risk in the calendar — there is no longer 5 hours a week of
> building on top of teaching through weeks 1–7.
>
> **What replaces the live build:** the app's **git history**. Build in module order, with
> Conventional Commits, so the log reads as a narrative — the commit where `SubjectList`
> was split, the commit where a boolean prop became `children`, the `feat(contract)!:`
> that versioned a breaking change. History is a better teaching artifact than live
> coding anyway: it cannot fail in front of the class, it can be read at any pace, and
> students can `git log` it themselves afterwards.

## Build order

The phases below are now **build order, not a calendar** — they all happen before week 1.
Build in this sequence anyway, because it is the order the modules explain and it is what
makes the history legible.

| Phase | Ships | Explained in |
|---|---|---|
| **0 · Skeleton** ✅ | repo, tokens, Tailwind theme | Module 1–2 opening |
| **1 · Contract & frontend** ◐ | contract done, 1 of 6 screens on the Prism mock | Module 2 (weeks 3–5) |
| **2 · Specimens** ◐ | unit tests and the vanilla-DOM twin done; `package.json` notes pending | Module 3 (weeks 5–6) |
| **3 · Backend** | Supabase, RLS, Edge Function, contract v2 | Module 4 (weeks 7–8) |
| **4 · Integration** | real base URL, Playwright, CI, deployed | Module 5 (week 8 + clinics) |
| **5 · Frozen** | no new code; the reference groups compare against | the dev phase (10–17) |

Roughly **30–40 hours**, all of it before the semester. That is the whole cost, paid once,
at a time when you are not also teaching.

### What each session actually looks like

Same four moves every time, so students learn the rhythm:

1. **Open the file.** Not a slide about the file — the file, in the editor, in a project
   that runs.
2. **Explain why it is shaped that way**, including what was tried and rejected.
3. **Show the commit** that introduced it, and read the message.
4. **Run it**, and break it once on purpose.

The deck's job shifts accordingly: it carries the *ideas* and the interactive instruments,
and the app carries the *evidence*. Neither duplicates the other.

## Phase 0 · Skeleton

The foundation everything else sits on. Get the tokens right here — every screen inherits
them, and a token change later means touching every commit that came after.

- [ ] `reference-app/` repo, public on GitHub, README pointing at `PROJECT-CONTEXT.md`
- [ ] Vite + React + TS + Tailwind, `tokens.css` from Module 1's token set
- [ ] shadcn/ui initialised, theme wired to the tokens
- [ ] `contract/openapi.yaml` — **`listSubjects` only**, deliberately incomplete
- [ ] Prism serving the mock, one screen listing subjects against it
- [ ] Vitest and Playwright installed but with no tests. Students should see the empty
      folders in Module 3 and 5 and know they were always part of the plan.

**Explained as:** the "Where this sits" slide stops being a diagram. You open a project
that runs, show the token file, and show the same three layers arriving in
`tailwind.config` — the thing Module 1 asked them to build, already load-bearing.

---

## Phase 1 · Contract & frontend

The heaviest phase, and the one whose history gets read most closely. Build in this order,
because it is the order the deck argues for — and commit at every step that has something
to explain.

| Lesson | Build | Explained from |
|---|---|---|
| 2.0 Git | real branches, real PRs, one deliberate conflict resolved | Open the actual commit graph. The deck's widget is the model; this is the real thing, with your name on it. |
| 2.1 Components | `SubjectRow`, `UnitMeter`, `EnrollmentTable`, `EmptyState`, `ErrorState` | The `git log` where `SubjectList.tsx` got split. Show the commit where a boolean prop became `children`. |
| 2.2 Auth Context | `SessionContext`, `useSession`, `RequireRole`, `/login` | Sign in as a student, then as an adviser; then delete the guard in devtools and land on `/advising` anyway. That is the RLS setup for Module 4. |
| 2.3 Contract | all 9 operations, error responses, `components.schemas`, Redoc published | Read one operation end to end, then the commit that added its 409. Break the YAML indentation and let `redocly lint` say so. |
| 2.4 Wrapper | `lib/api/client.ts`, TanStack Query on every screen | Devtools network tab: two screens, one request. Then approve an enrollment and watch the queue key invalidate. |
| 2.5 Data states | skeletons, the three empties, error + retry, 320px pass | Prism's `--errors` flag and Slow 3G throttling. Every state on the projector without editing a line. |

**Guardrails for this phase**

- Nine operations, no more. Every one you add is one more thing to keep in sync in sprint 1.
- Build the failures first on at least one screen: 409, 422, empty, offline. It reverses
  the habit students arrive with.
- **Commit messages are lesson material, not hygiene.** `feat(enrollment): add unit meter
  with ceiling warning` is the example on the slide; the real log has to look like the
  slide, because you will be projecting it.
- Commit at the granularity you want to *explain*, not the granularity that is convenient.
  One commit per idea. A commit containing three ideas cannot be read out loud.

---

## Phase 2 · Specimens

Module 3 is a tour of this codebase, so it needs three specimens that exist only to be
read.

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

## Phase 3 · Backend

The half of the app that carries every authorization claim in the course. RLS is the most
important uncovered topic in the syllabus, and 4.4 is explained entirely from this code.

- [ ] `supabase/migrations/` — the schema behind the contract's shapes
- [ ] RLS policies for R7 and R8, then **demonstrate the bypass being blocked**: sign in
      as student A, request student B's enrollment, get nothing back. Same request the
      deleted route guard let through in week 4 — a three-week callback, tight enough that
      the class still remembers it. Script this one; it is the best five minutes in Module 4.
- [ ] Constraints + a trigger for R2, so the unit ceiling is enforced where it counts
- [ ] An Edge Function for `submitEnrollment`, because it is a multi-table transaction
- [ ] `supabase gen types typescript` — the second instance of "schema is truth, types
      are downstream"
- [ ] **Contract v2.** Expect the week-5 spec to need breaking changes now that real
      modeling has been done. Version it properly: `feat(contract)!: …`, a note saying
      who has to change what, and keep v1 in the history.

**Explained as:** the v1 → v2 diff is the best slide in Module 4 and it has to be real.
When you write the contract in Phase 1, write it *before* doing the schema work in Phase 3
and do not go back and improve it. The mistakes are the artifact — and the groups are about
to make the same ones in sprint 1.

---

## Phase 4 · Integration

- [ ] Swap Prism for Supabase by changing **one environment variable**. Keep both `.env`
      files so you can flip it back and forth in front of the class — this is the payoff
      for the entire contract-first argument, and it takes ten seconds.
- [ ] Validation pass on every form, error shape end to end
- [ ] Playwright: the enrollment happy path, plus the R2 ceiling and the R7 forbidden
      case — **run as an authenticated role so RLS is exercised, not bypassed**
- [ ] GitHub Actions: lint, contract lint, stale-generated-types check, unit, e2e
- [ ] Deploy the frontend, point it at hosted Supabase, put the URL in the README
- [ ] Break something on purpose and let CI catch it in front of the class

---

## Phase 5 · Frozen — weeks 10–17

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
| **A finished app hides the decisions that made it.** | The git history is the mitigation, and it only works if it is built deliberately: one commit per idea, messages written to be read out loud. A history committed carelessly cannot be un-carelessed later. |
| **Explanation without live coding can slide into reading code aloud.** | The four moves in "What each session actually looks like" are the guard: why it is shaped that way, and what was tried and rejected. If a session has no rejected alternative in it, it is a code review, not a lesson. |
| **The demo drifts from the deck.** | Both live in git. When a slide changes, check the app; when the app changes, check the slide. The 12-point QA is the shared checklist. |
| **Students copy it wholesale.** | Different domain from all three project systems, and every rubric grades *justification*, not output. A boundary you cannot defend out loud at the Practical Exam scores nothing. |
| **The app is not finished by week 1.** | Phases 0–2 are the ones that must exist before teaching starts, because Modules 1–3 are explained entirely from them. Phase 3 has until week 6 and Phase 4 until week 7 without disrupting anything. |

---

## Progress · 2026-08-19

The repo exists at `../csci-153-enroll` with 14 commits, and everything green: `tsc -b`,
11 Vitest tests, a production build, and `redocly lint` clean.

**Done:** the contract (9 operations, every one documenting its 401 and its failures),
generated types, the typed client with auth and error interception, the enrollment rules as
pure functions, `SessionContext` with the loading branch and the route guard, the shared
loading/empty/error states, the subject catalog with all four data states reachable against
the Prism mock, the unit-ceiling tests, the vanilla-DOM twin for 3.6, and `DEMOS.md`.

**Next, in order:**

1. The five remaining screens — my enrollment, enrollment status, adviser queue, adviser
   review. Each one is a mutation plus a cache invalidation, so they go quickly now that
   the wrapper and keys exist.
2. shadcn/ui, for the dialog on adviser return. Not before it is needed.
3. The annotated `package.json` for lesson 3.1.
4. Phase 3, the backend. Write no contract changes until the schema work forces them — the
   v1→v2 diff is Module 4.7 and it cannot be manufactured afterwards.

## Start here

1. Create the repo and commit `PROJECT-CONTEXT.md` as the first commit — so the context
   file is older than the code, which is the point being taught.
2. Phase 0, then 1, then 2. Those three must exist before week 1, because Modules 1–3 are
   explained entirely from them.
3. Write `contract/openapi.yaml` with all nine operations **before** any schema work, and
   then leave it alone. Phase 3 will prove parts of it wrong; that diff is Module 4.7 and
   it cannot be manufactured after the fact.
4. Keep a running `DEMOS.md` as you build. Every time you notice "this would explain X
   well", write it down with the file path and the commit hash. By week 1 that file is
   your lecture notes.
