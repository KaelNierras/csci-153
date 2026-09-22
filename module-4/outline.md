# Module 4 — Frontend Development · outline

**CSci 153 · Clinics in weeks 11–13 and 15 · Milestone 4 · CO2 and CO5**
Syllabus LOs: **LO 5.1** validate user inputs on client and server layers ·
**LO 5.2** utilize API endpoints for frontend application ·
**LO 5.3** deploy a web application to a cloud platform · **LO 3.5** JSON
serialize/deserialize — relocated here 2026-09-22, met in lesson 4.2 where the typed client
actually sends and receives it
*(CO2's LOs — 2.1 and 2.2 — are attained in Module 1, lesson 1.4.)*

Status: **ready** — 37 slides, `module-4/index.html`. Interactive instruments: the
prop-drilling visualiser (4.1), the query cache (4.2), the validation bypass (4.4) — the same
bad write sent by a form, by devtools, by a REST client, and with a service-role key — and the
three-place deployment map (4.6).

> ## The milestone
>
> **Consume the backend that now exists.** Taught as four ~45–60 minute clinics inside the
> development phase, each in the week it is applied, and built across sprints 2–4.
>
> This is the same exception the calendar already made for deployment and e2e, extended to the
> wiring lessons for the same reason: teaching students to consume an API eight weeks before
> they have one to consume guarantees it is re-taught.

---

## Lesson order

| # | Lesson | LO | Slides | Clinic |
|---|---|---|---|---|
| 4.1 | **Auth Context + route protection** | *(no LO)* | 6 | **W11**, ~45 min |
| 4.2 | **API wrapper, interception, server state** | *(no LO)* | 5 | **W12**, ~60 min |
| 4.3 | **Data states in practice** | *(no LO)* | 6 | **W12** |
| 4.4 | **Two-layer validation** | 5.1 | 5 | **W13**, ~60 min |
| 4.5 | **Integration day** | 5.2 | 4 | **W13** |
| 4.6 | **Deployment** | 5.3 | 4 | **W15**, ~45 min |

**End-to-end testing and the codebase assessment moved to Module 5** on 2026-09-22, along
with Activity 10. This module builds and ships the frontend; proving it works is a milestone
of its own. Old 4.6 → 5.1, old 4.8 → 5.5, and old 4.7 Deployment became 4.6.

**Nothing here carries a CO2 outcome.** 4.1, 4.2 and 4.3 were Module 2's lessons 2.2, 2.4 and
2.5; all three are enrichment. LO 2.1 and LO 2.2 are both attained by lesson 1.4 in week 3 and
assessed by A3 in week 4, so moving these three into the development phase moves no outcome.

---

## 4.2 · Server state

TanStack Query belongs here rather than in its own lesson, because it only makes sense once
the wrapper exists. The point to land: **server data is not component state.** It is a cache
of something that lives elsewhere, and it goes stale.

Query keys derive from the contract's `operationId` plus its parameters, which makes
invalidation-after-mutation mechanical instead of guesswork. Contrast against Context from
4.1: Context is for state the client owns; Query is for state the server owns. Students who
blur the two copy fetched data into Context and then hand-sync it — worth showing that failure
once, on purpose.

**Students have read `client.ts` already**, in lesson 2.7. This is where they write one.

---

## 4.4 · Two-layer validation

- **Client (Zod + React Hook Form)** — stops a wasted round trip and tells the user what is
  wrong while they are still looking at the field. It is a UX affordance.
- **Server (RLS, constraints, function checks)** — the actual enforcement, because the client
  runs on a machine the user controls.

Demonstrate by bypassing the form entirely and posting a payload with a REST client. If only
the client validated, the bad row lands. That is the whole lesson, and the reference app's
`e2e/validation.spec.ts` is the same demonstration written as a test.

---

## 4.5 · Integration day — no longer a cliff

Under the old sequence this was the first time the frontend met the backend, in week 13, and
the failure surface was the whole application. Screens are now wired to the real backend one at
a time from sprint 2, so this session **explains what the contract bounded** with the evidence
already on the students' own screens.

Anything that breaks is either a contract violation (the backend did not implement what was
agreed) or a contract error (what was agreed was wrong). Both are specific, findable problems —
which is the argument for contract-first, made concrete rather than asserted. It is a better
lesson for having less to fix.

---

## 4.6 · Deployment

Cover: a static SPA build versus a server · the catch-all rewrite to `index.html`, and why deep
links 404 without it · deploying Edge Functions separately from the frontend · environment
variables per environment · **secrets go to `supabase secrets set`, never to the host's
environment panel**, since `VITE_` variables are compiled into a public bundle (demonstrated
already in 3.5).

---

## Laboratory

| Activity | Week |
|---|---|
| **A9** Deployed staging build | 15 — **the milestone gate** |

A10 moved to Module 5 with the end-to-end lesson it depends on.

---

## Carried forward — everything

```
Milestone 1  UI/UX      design the screen, then build it static
Milestone 2  Contract   agree the shape of the data
Milestone 3  Backend    implement that shape
Milestone 4  Frontend   consume it, validate it, ship it
Milestone 5  QA         prove it works, then hand it over
```

Read it as one sentence: **you cannot agree a contract for data you have not modelled, you
cannot implement a contract you have not agreed, you cannot consume an implementation that
does not exist, and you cannot accept a system you have never run end to end.** Each milestone
hands the next one the artifact it needs.
