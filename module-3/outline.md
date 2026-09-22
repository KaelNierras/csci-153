# Module 3 — Backend Development · outline

**CSci 153 · Weeks 7–8 · Milestone 3 · CO4** — *Create a backend server with RESTful API
endpoints for database operations*
Syllabus LOs: **LO 4.2** develop API endpoints for CRUD operations
*(LO 4.1, schema modelling, is taught in Module 2 — see below.)*

Status: **ready** — 42 slides, `module-3/index.html`. Interactive instruments: the RLS
simulator (3.3) — four identities against one query, with the policy switchable — the
constraint tester (3.4), a `contract:check` runner that starts red (3.6), and a CI pipeline
with a merge gate (3.7).

> ## The milestone
>
> **Implement the shape agreed in Module 2.** Lectured in weeks 7–8, built in sprints 1–2
> (weeks 10–13). Two gates: another group's account cannot read your rows, demonstrated
> against a live database; and `contract:check` passes with CI green and required before merge.

> **Framing note.** CO4 says "backend server." These projects have no server of their own —
> Supabase is the backend, and the API surface is PostgREST plus Edge Functions. The outcome
> still holds, and arguably more directly: students model a real schema and produce real CRUD
> endpoints over it. What changes is that *authorization moves into the database*, which is
> the single most important idea in this module.

---

## Lesson order

| # | Lesson | LO | Slides | Why it sits here |
|---|---|---|---|---|
| 3.1 | **Migrations** | 4.1 | 4 | Schema as versioned, reviewable files, not clicks in a dashboard |
| 3.2 | **CRUD endpoints over the schema** | 4.2 | 4 | PostgREST gives you the endpoints; the work is deciding which you are entitled to call |
| 3.3 | **Row Level Security — briefly** | *(no LO)* | 8 | The enforcement layer the whole project rests on |
| 3.4 | **Constraints and triggers — briefly** | *(no LO)* | 5 | Rules the client cannot be trusted with |
| 3.5 | **Edge Functions — briefly** | *(no LO)* | 4 | Where secrets and multi-step writes live |
| 3.6 | **Implementing the contract** | 4.2 | 5 | The acceptance criterion: does it satisfy Module 2's document? |
| 3.7 | **CI — briefly** | *(no LO)* | 4 | Moved up from a week-13 clinic; the dev phase needs a merge gate from its first PR |

**Where lesson 4.1 went.** Schema modelling is now **lesson 2.1**, taught in week 4 in the
same block as the contract. Migrations (3.1) therefore arrive three weeks after the model was
drawn rather than in the same hour, which is the right order: you draw it, you specify an API
over it, and only then do you commit it to versioned files.

---

## 3.3 · Row Level Security — the brief version

**Not covered by any syllabus LO, and the most important of the uncovered topics.** Every
authorization claim in all three project specs rests on it: *"route guards are redirect
conveniences only; RLS is what separates the roles."*

Cover: a policy is a `WHERE` clause the database adds for you · `auth.uid()` · `USING` vs
`WITH CHECK` · one policy per role per operation · the service role bypasses everything,
which is why it never reaches a browser.

The demonstration that makes it land: **open the app's own anon key in a REST client and try
to read another user's row.** Watch it come back empty — not forbidden, *empty*. Then disable
the policy and watch the same request return everything.

**One sequencing note.** Under the old order this lesson could point back at the route guard
students had already built and deleted in devtools. The guard is now lesson 4.1, four weeks
*later*, so the callback runs forwards instead: this module establishes what enforcement is,
and 4.1 arrives already knowing that a guard is a convenience.

---

## 3.4 · Constraints and triggers — the brief version

**No LO**, ~1 session. The specs lean on these constantly: capacity enforcement, zero-gap
adviser continuity, cached rollups, append-only audit logs.

Cover: `CHECK`, `UNIQUE`, `NOT NULL`, foreign keys with the right `ON DELETE` · what a trigger
is and when a rollup should be maintained by one · why "the frontend validates it" is not an
answer to "what stops a bad row."

---

## 3.5 · Edge Functions — the brief version

**No LO**, ~1 session. The decision rule: *plain read or single-row write goes to PostgREST;
secret, privileged write, or multi-step goes to a function.*

The demonstration: put an API key in a `VITE_` variable, build, and find it in the bundle with
devtools. It reframes "keep secrets on the server" from a rule into an observation.

---

## 3.6 · Implementing the contract

```
data model              drawn week 4, lesson 2.1
        ↓
contract/openapi.yaml   written week 4–5, unchanged unless versioned
        ↓
schema + RLS + Edge Functions   lectured weeks 7–8, built in sprints 1–2
        ↓
npm run contract:check   passes, or the milestone is not done
```

Groups do not design an API here — they were handed one in Module 2, by themselves, three
weeks earlier and on top of a model they drew the same afternoon. Expect contract v2, and
version it properly; what would be a failure is silently editing the frontend to match a
drifted backend.

---

## Laboratory

| Activity | Week |
|---|---|
| **A7** Schema + migrations | 7 |
| **A8** RLS policies | 8 |

Neither exists yet; both are needed by week 6.

---

## Carried forward

- The contract from Module 2 is the specification; `contract:check` is the grader
- `supabase gen types typescript` is the same principle as `openapi-typescript` in
  Module 2 — schema is truth, types are downstream
