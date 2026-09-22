# Module 5 — Web Application Integration · outline

**CSci 153 · Week 8 (lesson 5.4) and clinics in weeks 13–15 · CO5** — *Deploy a fully working web application integrating
frontend, backend, and database components*
Syllabus LOs: **LO 5.1** validate user inputs on client and server layers ·
**LO 5.2** utilize API endpoints for frontend application ·
**LO 5.3** deploy a web application to a cloud platform

Status: **ready** — 32 slides, `module-5/index.html`. Interactive instruments: the
validation bypass (5.1) — the same bad write sent by a form, by devtools, by a REST client,
and with a service-role key — a CI pipeline with a merge gate (5.4), and the three-place
deployment map (5.5).

This module was five weeks of mostly supervised build time with short inputs. Under the
milestone sequence (`../plan/milestones.md`) almost all of it is clinics: **5.4 CI is the
only lecture**, at the end of week 8, and 5.1, 5.2, 5.3 and 5.5 are ~45–60 minute clinics
in weeks 13, 14 and 15 — each taught in the week it is applied. 5.6 is the graded
read-through in weeks 16–17.

The supervised build time did not disappear; it became weeks 10–17.

> ## ⬛ Split between Milestone 3 and Milestone 4
>
> Resequenced 2026-09-22 (`../plan/milestones.md`).
>
> | Lesson | Milestone | When |
> |---|---|---|
> | 5.4 CI — briefly | **3 · Backend** | **Week 8 lecture** — moved up from a week-13 clinic |
> | 5.1 Two-layer validation | **4 · Frontend** | Week 13 clinic, ~60 min |
> | 5.2 Integration day | **4 · Frontend** | Week 13 clinic, ~60 min |
> | 5.3 End-to-end testing | **4 · Frontend** | Week 14 clinic, ~45 min |
> | 5.5 Deployment | **4 · Frontend** | Week 15 clinic, ~45 min |
> | 5.6 Codebase assessment | — | Weeks 16–17, graded read-through |
>
> **5.4 moved earlier** because everything CI runs exists by week 8. Wiring it at the start
> of the dev phase gates every sprint from its first pull request instead of its sixth.
>
> **5.2 Integration day is no longer a cliff.** Under the old order the frontend met the
> backend for the first time in week 13, and the failure surface was the whole application.
> Screens are now wired to the real backend one at a time from sprint 2, so 5.2 became the
> session that *explains* what the contract bounded — with the evidence already on the
> students' own screens. It is a better lesson for having less to fix.

---

## Lesson order

| # | Lesson | Syllabus LO | Milestone · week | Why it sits here |
|---|---|---|---|---|
| 5.4 | **CI — briefly** | *(no LO)* | **3 · W8 lecture** | GitHub Actions running what students already run by hand. Taught first, so the whole dev phase is gated |
| 5.1 | **Two-layer validation** | 5.1 | **4 · W13** | Zod on the form, RLS and function checks on the server — and why the client half is only a courtesy |
| 5.2 | **Integration day** | 5.2 | **4 · W13** | The screens are already on the real backend. This is the session that explains what the contract bounded |
| 5.3 | **End-to-end testing — briefly** | *(no LO)* | **4 · W14** | ~1 session. Playwright, and test-cases-as-issues |
| 5.5 | **Deployment** | 5.3 | **4 · W15** | Static build to Vercel, functions to Supabase, secrets in neither place at once |
| 5.6 | **Codebase assessment** | — | — · W16–17 | The graded read-through of the repository |

Rows are in **delivery order**. The numbering is kept because the deck refers to it.

---

## 5.1 · Two-layer validation

LO 5.1 maps onto the specs exactly, so this teaches itself — the useful framing is
*why* the layers are not redundant:

- **Client (Zod + React Hook Form)** — stops a wasted round trip and tells the user
  what is wrong while they are still looking at the field. It is a UX affordance.
- **Server (RLS, constraints, function checks)** — the actual enforcement, because the
  client runs on a machine the user controls.

Demonstrate the point by bypassing the form entirely and posting a payload with a REST
client. If only the client validated, the bad row lands. That is the whole lesson.

---

## 5.2 · Integration day

The payoff slide of the whole semester. Groups change one base URL and their app talks
to their own backend.

Realistically it will not be seamless, and the goal is to make the failures *legible*:
the contract bounds what can break. Anything that does break is either a contract
violation (the backend did not implement what was agreed) or a contract error (what was
agreed was wrong). Both are specific, findable problems — which is the argument for
contract-first, made concrete rather than asserted.

---

## 5.3 · End-to-end testing — the brief version

**No LO**, ~1 session, building on Module 3's unit-testing session (3.8).

Cover: what an e2e test is versus a unit test · Playwright driving a real browser ·
writing one test for one already-written test-case issue · why e2e tests must run as an
authenticated role, so RLS is actually exercised rather than bypassed.

The specs' §12 workflow — the Project Manager raises test cases as issues, a contributor
implements the Playwright test, the PR closes the issue — is the deliverable. One worked
example, then groups do the rest.

---

## 5.4 · CI — the brief version

**No LO**, ~1 session. Frame it as automation of what they already do by hand:

```
what you run locally          what CI runs on every PR
  npm run lint            →     the same
  npm run typecheck       →     the same
  npm run test            →     the same
  npm run contract:check  →     the same, and it is the one that catches drift
```

Cover: a workflow file is a list of commands and when to run them · required checks
before merge · why a red build blocks a merge instead of being ignored. Skip matrices,
caching, and reusable workflows.

---

## 5.5 · Deployment

Cover: a static SPA build versus a server · the catch-all rewrite to `index.html`, and
why deep links 404 without it · deploying Edge Functions separately from the frontend ·
environment variables per environment · **secrets go to `supabase secrets set`, never to
the host's environment panel**, since `VITE_` variables are compiled into a public
bundle (demonstrated already in Module 4.6).

---

## Carried forward — everything

By this point the semester's through-line should be visible in one slide:

```
Milestone 1  UI/UX      design the screen, then build it static
                        tokens · states · the 8-point QA · components
Milestone 2  Contract   agree the shape of the data
                        the model · OpenAPI · generated types · the stack, named
Milestone 3  Backend    implement that shape
                        migrations · RLS · triggers · Edge Functions · CI
Milestone 4  Frontend   consume it, validate it, ship it
                        auth · the wrapper · server state · e2e · deployment
```

Read it as one sentence: **you cannot agree a contract for data you have not modeled, you
cannot implement a contract you have not agreed, and you cannot consume an implementation
that does not exist.** Each milestone hands the next one the artifact it needs.
