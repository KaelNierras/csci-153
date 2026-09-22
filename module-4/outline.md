# Module 4 — Backend Development · outline

**CSci 153 · Week 4 (lesson 4.1) and weeks 7–8 (4.2–4.7) · CO4** — *Create a backend server with RESTful API endpoints
for database operations*
Syllabus LOs: **LO 4.1** model relational database schemas ·
**LO 4.2** develop API endpoints for CRUD operations

Status: **ready** — 44 slides, `module-4/index.html`. Interactive instruments: the
normalisation stepper (4.1), the RLS simulator (4.4) — four identities against one query,
with the policy switchable — the constraint tester (4.5), and a `contract:check` runner
that starts red (4.7).

> **Framing note.** CO4 says "backend server." These projects have no server of their
> own — Supabase is the backend, and the API surface is PostgREST plus Edge Functions.
> The outcome still holds, and arguably more directly: students model a real schema and
> produce real CRUD endpoints over it. What changes is that *authorization moves into
> the database*, which is the single most important idea in this module.

> ## ⬛ Lesson 4.1 moved forward, to the head of the Contract milestone
>
> Resequenced 2026-09-22 (`../plan/milestones.md`). **4.1 Modeling the data is taught in
> week 4**, in the same block as the OpenAPI lesson and three weeks before the rest of this
> module. 4.2–4.7 stay in weeks 7–8 as Milestone 3.
>
> **Why:** groups used to author `openapi.yaml` in week 4 having never modeled a schema, and
> this outline said so out loud — *"expect breaking changes here, and say so in advance."*
> Planned rework is still rework. You now model what exists, then write down how it is
> exposed. The week-4 lab is the ERD-and-contract clinic, so the modeling is applied within
> the hour it is taught.
>
> **This does not eliminate contract v2**, and it should not. A model drawn in week 4 will
> still be wrong in places. What changes is that the corrections are refinements rather than
> discoveries, and 4.7's `contract:check` now lands two weeks after the contract instead of
> five.
>
> **One lesson joined this module.** M5.4 CI is taught at the end of week 8, not as a
> week-13 clinic: `lint`, `typecheck`, `test` and `contract:check` all exist by then, and
> the dev phase needs a merge gate from its first pull request.

---

## Lesson order

| # | Lesson | Syllabus LO | Milestone · week | Why it sits here |
|---|---|---|---|---|
| 4.1 | **Modeling a relational schema** | 4.1 | **2 · W4** | Tables, keys, relationships, normalization — from the group's own spec §6. **Taught before the contract**, so the contract describes a model that exists |
| 4.2 | **Migrations** | 4.1 | **3 · W7** | Schema as versioned, reviewable files, not clicks in a dashboard |
| 4.3 | **CRUD endpoints over the schema** | 4.2 | **3 · W7** | PostgREST gives you the endpoints; the work is deciding which ones you are entitled to call |
| 4.4 | **Row Level Security — briefly** | *(no LO)* | **3 · W7** | ~1–2 sessions. The enforcement layer the whole project rests on |
| 4.5 | **Constraints and triggers — briefly** | *(no LO)* | **3 · W8** | ~1 session. Rules the client cannot be trusted with |
| 4.6 | **Edge Functions — briefly** | *(no LO)* | **3 · W8** | ~1 session. Where secrets and multi-step writes live |
| 4.7 | **Implementing the contract** | 4.2 | **3 · W8** | The acceptance criterion: does it satisfy the contract agreed in week 4? |
| 5.4 | **CI — briefly** *(from Module 5)* | *(no LO)* | **3 · W8** | Moved up from a week-13 clinic. Everything it runs exists by now, and the dev phase needs a merge gate from its first PR |

---

## 4.4 · Row Level Security — the brief version

**Not covered by any syllabus LO, and the most important of the uncovered topics.**
Every authorization claim in all three project specs rests on it: *"route guards are
redirect conveniences only; RLS is what separates the roles."* A student who never
learns it will write the specs' security model without understanding what enforces it.

Cover: a policy is a `WHERE` clause the database adds for you · `auth.uid()` ·
`USING` vs `WITH CHECK` · one policy per role per operation · the service role bypasses
everything, which is why it never reaches a browser.

The demonstration that makes it land: **open the app's own anon key in a REST client and
try to read another user's row.** Watch it come back empty — not forbidden, *empty*.
Then disable the policy and watch the same request return everything. Five minutes,
and no one forgets which layer is doing the work.

Keep it practical. Skip policy performance tuning and complex `security definer`
patterns unless a group hits them.

---

## 4.5 · Constraints and triggers — the brief version

**No LO**, ~1 session. The specs lean on these constantly: capacity enforcement,
zero-gap adviser continuity, cached rollups (`party_size`, GWA), append-only audit logs.

Cover: `CHECK`, `UNIQUE`, `NOT NULL`, foreign keys with the right `ON DELETE` ·
what a trigger is and when a rollup should be maintained by one · why "the frontend
validates it" is not an answer to "what stops a bad row."

One worked example from the group's own spec is worth more than five generic ones.

---

## 4.6 · Edge Functions — the brief version

**No LO**, ~1 session. Everything needing a secret, a privileged write, or a
multi-statement transaction lives here.

Cover: what a serverless function is · the decision rule — *plain read or single-row
write goes to PostgREST; secret, privileged write, or multi-step goes to a function* ·
`supabase secrets set`, and why a key in a `VITE_` variable is a key you published ·
returning the same error shape as PostgREST so the client has one error path.

The demonstration: put an API key in a `VITE_` variable, build, and find it in the
bundle with browser devtools. It reframes "keep secrets on the server" from a rule into
an observation.

---

## 4.7 · Implementing the contract

The module's real assessment. Groups do not design an API here — they were handed one
in Module 2, by themselves. The question is whether the implementation satisfies it.

```
data model              drawn week 4, lesson 4.1
        ↓
contract/openapi.yaml   written week 4–5, unchanged unless versioned
        ↓
schema + RLS + Edge Functions   lectured weeks 7–8, built in sprints 1–2 (weeks 10–13)
        ↓
npm run contract:check   passes, or the milestone is not done
```

**Expect contract v2, and say so in advance** — but expect less of it than before. Since
2026-09-22 the model is drawn in the same block as the contract (4.1 moved to week 4), so
the corrections made here are refinements rather than discoveries. Versioning the change
and reviewing it *is* the method. What would be a failure is silently editing the frontend
to match a drifted backend.

---

## Carried forward

- The contract from Milestone 2 is the specification; `contract:check` is the grader
- `supabase gen types typescript` is the same principle as `openapi-typescript` in
  Module 2 — schema is truth, types are downstream
