# Module 4 — Backend Development · outline

**CSci 153 · Weeks 10–12 · CO4** — *Create a backend server with RESTful API endpoints
for database operations*
Syllabus LOs: **LO 4.1** model relational database schemas ·
**LO 4.2** develop API endpoints for CRUD operations

Status: **planning**. Deck not built yet.

> **Framing note.** CO4 says "backend server." These projects have no server of their
> own — Supabase is the backend, and the API surface is PostgREST plus Edge Functions.
> The outcome still holds, and arguably more directly: students model a real schema and
> produce real CRUD endpoints over it. What changes is that *authorization moves into
> the database*, which is the single most important idea in this module.

---

## Lesson order

| # | Lesson | Syllabus LO | Why it sits here |
|---|---|---|---|
| 4.1 | **Modeling a relational schema** | 4.1 | Tables, keys, relationships, normalization — from the group's own spec §6 |
| 4.2 | **Migrations** | 4.1 | Schema as versioned, reviewable files, not clicks in a dashboard |
| 4.3 | **CRUD endpoints over the schema** | 4.2 | PostgREST gives you the endpoints; the work is deciding which ones you are entitled to call |
| 4.4 | **Row Level Security — briefly** | *(no LO)* | ~1–2 sessions. The enforcement layer the whole project rests on |
| 4.5 | **Constraints and triggers — briefly** | *(no LO)* | ~1 session. Rules the client cannot be trusted with |
| 4.6 | **Edge Functions — briefly** | *(no LO)* | ~1 session. Where secrets and multi-step writes live |
| 4.7 | **Implementing the contract** | 4.2 | The acceptance criterion: does it satisfy the Module 2 spec? |

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
contract/openapi.yaml   written week 3–5, unchanged unless versioned
        ↓
schema + RLS + Edge Functions   built weeks 10–12
        ↓
npm run contract:check   passes, or the module is not done
```

**Expect breaking changes here, and say so in advance.** A contract authored in week 3
by students who had not yet learned schema modeling will have mistakes. That is not a
failure of the method — versioning the change and reviewing it *is* the method. What
would be a failure is silently editing the frontend to match a drifted backend.

---

## Carried forward

- The contract from Module 2 is the specification; `contract:check` is the grader
- `supabase gen types typescript` is the same principle as `openapi-typescript` in
  Module 2 — schema is truth, types are downstream
