# Module 2 — The Contract · outline

**CSci 153 · Weeks 4–6 · Milestone 2 · CO4**
Syllabus LO taught here: **LO 4.1** model relational database schemas
**CO3 is not lectured in this module** — see *What this module does not teach* below.

Status: **ready** — 35 slides, `module-2/index.html`. Interactive instruments: the
normalisation stepper (2.1), the spec explorer, schema→type and contract diff (2.2), and a
test runner whose ceiling the class can break on purpose (2.3).

> ## The milestone
>
> **Agree the shape of the data, before either side is built.** The deliverable is one
> `openapi.yaml` with a data model behind it, types generated from it, and screens from
> Milestone 1 running against a Prism mock of it.
>
> This module did not exist before 2026-09-22. It was one lesson (the old 2.3) buried in the
> middle of a frontend module. It is now the hinge of the semester, and it absorbs the whole
> of the old Module 3 — because that module's anchor files *are* contract artifacts.

---

## Lesson order

The sequence is load-bearing: you model what exists, you write down how it is exposed, and
then you meet every tool that turns that document into code.

| # | Lesson | LO | Slides | The file it opens |
|---|---|---|---|---|
| 2.1 | **Modelling the data** | 4.1 | 6 | the group's own spec §6 |
| 2.2 | **The API contract — OpenAPI** | *(no LO)* | 15 | `contract/openapi.yaml` |
| 2.3 | **Does it work? — briefly** | *(no LO)* | 5 | `src/lib/rules/units.test.ts` |

**Week 4** is 2.1 and 2.2 — two dense inputs in one block, with the ERD-and-contract clinic
that afternoon. **Week 5** is the contract authoring clinic and the prior-knowledge diagnostic; **week 6** is 2.3, the mock, and the gate.

---

## 2.1 · Modelling the data — why it is first

This was lesson 4.1, taught in week 7, three weeks *after* groups wrote their contract. The
old Module 4 outline said the consequence out loud: *"expect breaking changes here, and say
so in advance."* Planned rework is still rework.

Moving it here does not eliminate contract v2, and it should not — a model drawn in week 4
will still be wrong in places. What changes is that the corrections made in sprint 1 are
**refinements rather than discoveries**.

---

## 2.2 · The API contract — the longest lesson in the course

Fifteen slides, and four of them are worked examples added 2026-09-22 because the lesson
argued its case well and demonstrated it poorly:

| Slide | What it shows |
|---|---|
| **One operation, end to end** | The YAML beside the actual HTTP request and JSON response it describes. The mapping, until it is boring. |
| **Shapes in one place** | `$ref` and `components.schemas` — the same response written out nine times and wrong once, beside it defined once. `enum` earning its keep. |
| **Sentence to spec** | One requirement from the group's own spec, turned into one operation in four questions. This *is* Activity 4. |
| **Failures are shapes too** | A documented 422 with an example body, the `code`/`message`/`details` split, and the fact that Prism will serve that example today. |


**Framing:** the contract is agreed before either side is built. In this course that is
literally true — the backend is Module 3, three weeks away, and the frontend wiring is
Module 4, seven.

**Say the cost out loud.** Under the old sequence the gap was five weeks, which made the
argument for contract-first by itself. It is now three, so a group could reasonably ask why
they should not just wait for the backend. The answer is this milestone's gate: running
screens on the Prism mock. A group that waited has nothing to show in week 6.

---

## What this module does *not* teach

**Two rounds of removals, both on 2026-09-22.** First the JavaScript and React lessons
(iteration, functions and modules, React-and-the-DOM). Then the rest of the stack tour —
*The stack, named*, *TypeScript in five ideas*, *JSON, fetch and await*, and *Choosing a
library*. Thirty-six slides in total; the module went 67 → 35.

**The rule behind both cuts:** lecture only what the previous subject did not cover. That
subject taught JavaScript, React, and npm and the toolchain.

**Where CO3 lives now.** It is not lectured in this module, and five of its seven outcomes
are not lectured anywhere:

| LO | Where it is met |
|---|---|
| 3.1 types and structures | **Module 3**, *Generated types, again* — read off `database.types.ts` |
| 3.2 block scoping | Prior course |
| 3.3 loop structures | Prior course |
| 3.4 functions and arrows | Prior course |
| 3.5 JSON serialize/deserialize | **Module 4**, lesson 4.2 — the typed client |
| 3.6 DOM manipulation | Prior course; React is the DOM layer from Lesson 1.4 |
| 3.7 JavaScript libraries | Prior course |

**This is the course's largest OBE exposure and it needs one artifact to close it.** The
**week-5 prior-knowledge diagnostic does not exist yet.** Until it does, five learning
outcomes rest on an assertion that students covered the material before, with nothing on
file to show it. Writing it is not optional bookkeeping — it is the evidence.

**Generated types were deliberately deferred**, not dropped. Lesson 2.2 still demonstrates
the contract producing them (*Schema → type*, interactive) and names the pattern that
recurs (*The same idea twice*). The fuller treatment belongs in Module 3, where
`supabase gen types` runs against a schema that exists, and in Module 4, where the typed
client actually consumes them. Since the backend now precedes the frontend, teaching
generation before either exists was teaching it twice.

> **One distinction not to lose.** `supabase/database.types.ts` does **not** replace
> `contract/generated/schema.d.ts`. The first types your *tables*; the second types your
> *API surface*, and it is what `createClient<paths>` needs. Two sources of truth, and both
> Module 3 and Module 4 say so explicitly.

---

---

## 2.3–2.7 · The toolchain tour


## Laboratory

| Activity | Week | |
|---|---|---|
| **A4** The contract | 5 | group |
| **A5** Your screens, on your mock | 6 | group — **the milestone gate** |
| **A6** First unit tests | 6 | individual |

**A5 was rewritten.** It used to be *"account for your `package.json`"*, which rested on the
deleted stack lesson. It is now the milestone gate: the static screens from Lesson 1.4,
running against a Prism mock of the group's own contract, with generated types in sync and
one designed failure state reachable. A group that waited for the backend has nothing to
show — which is what makes contract-first a practice rather than a slogan.

Neither brief is written yet. Both are needed by week 6.

---

## The spec is the spine of the semester

```
Milestone 2   agree it       a data model, then openapi.yaml, then generated types
Milestone 3   implement it   schema, RLS, and endpoints that satisfy that document
Milestone 4   consume it     typed wrapper and screens, then the real base URL
```

Module 3 then has a real acceptance criterion: *does your implementation satisfy the contract
you agreed two weeks ago?* — and Module 4 has a guarantee: if the backend satisfies the
contract, the screens built against the mock will work against it.
