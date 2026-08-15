# Module 5 — Web Application Integration · outline

**CSci 153 · Weeks 13–17 · CO5** — *Deploy a fully working web application integrating
frontend, backend, and database components*
Syllabus LOs: **LO 5.1** validate user inputs on client and server layers ·
**LO 5.2** utilize API endpoints for frontend application ·
**LO 5.3** deploy a web application to a cloud platform

Status: **planning**. Deck not built yet.

Five weeks, and the Final Activity Project is due at the end of it. This module is
mostly supervised build time with short inputs, not lecture.

---

## Lesson order

| # | Lesson | Syllabus LO | Why it sits here |
|---|---|---|---|
| 5.1 | **Two-layer validation** | 5.1 | Zod on the form, RLS and function checks on the server — and why the client half is only a courtesy |
| 5.2 | **Integration day** | 5.2 | Swap the mock for the real base URL. What breaks, and why the contract limits it |
| 5.3 | **End-to-end testing — briefly** | *(no LO)* | ~1 session. Playwright, and test-cases-as-issues |
| 5.4 | **CI — briefly** | *(no LO)* | ~1 session. GitHub Actions running what students already run by hand |
| 5.5 | **Deployment** | 5.3 | Static build to Vercel, functions to Supabase, secrets in neither place at once |
| 5.6 | **Codebase assessment** | — | The graded read-through of the repository |

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

**No LO**, ~1 session, building on Module 3's unit-testing session.

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
M1  design the screen         tokens, states, the 8-point QA
M2  build it, agree the contract   components, Context, OpenAPI, typed client
M3  the language underneath   JS, JSON, the DOM, unit tests
M4  implement the contract    schema, RLS, triggers, Edge Functions
M5  connect and ship          validation, integration, CI, deployment
```
