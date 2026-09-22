# Module 2 — The Contract · outline

**CSci 153 · Weeks 4–6 · Milestone 2 · CO3 and CO4**
Syllabus LOs **taught here**: **LO 4.1** model relational database schemas ·
**LO 3.1** types and structures · **LO 3.2** block scoping ·
**LO 3.5** JSON serialize/deserialize · **LO 3.7** JavaScript libraries
Syllabus LOs **assumed from the prior course**, verified not taught: **LO 3.3** loop
structures · **LO 3.4** functions and arrow expressions · **LO 3.6** DOM manipulation

Status: **ready** — 56 slides, `module-2/index.html`. Interactive instruments: the
normalisation stepper (2.1), the spec explorer, schema→type and contract diff (2.2), the
dependency auditor (2.3), the await timeline (2.5), and a test runner whose ceiling the
class can break on purpose (2.7).

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
| 2.3 | **The stack, named** | 3.7 | 6 | `package.json` |
| 2.4 | **TypeScript in five ideas** | 3.1, 3.2 | 5 | `contract/generated/schema.d.ts` |
| 2.5 | **JSON, `fetch`, and `await`** | 3.5 | 6 | `src/lib/api/client.ts` |
| 2.6 | **Choosing a library** | 3.7 | 4 | the dependency list, judged |
| 2.7 | **Does it work? — briefly** | *(no LO)* | 5 | `src/lib/rules/units.test.ts` |

**Week 4** is 2.1 and 2.2 — two dense inputs in one block, with the ERD-and-contract clinic
that afternoon. **Week 5** is 2.3–2.4, **week 6** is 2.5–2.7.

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

**Removed 2026-09-22: the JavaScript and React lessons.** Three lessons went — iteration
(`for…of`, `map`, `reduce`), functions and modules (arrows, closures, `import`/`export`),
and *What React does for you* (the DOM, built by hand then in React). Fifteen slides.

**Why:** all three were taught in the prior course. Re-teaching them spent a third of this
module on the thing that is not blocking students, at the cost of the thing that is — the
contract.

**What happened to their outcomes.** LO 3.3 (loops), LO 3.4 (functions) and LO 3.6 (DOM)
are now declared **prior-course knowledge, verified rather than taught**:

| LO | Where it is now |
|---|---|
| 3.3 loop structures | Prior course · verified in the week-5 lab diagnostic |
| 3.4 functions and arrows | Prior course · verified in the week-5 lab diagnostic |
| 3.6 DOM manipulation | Prior course · React is the DOM layer from Lesson 1.4 onward |

This is stated on the module's **Assumed knowledge** orientation slide and in the CO3
coverage table inside the deck, so an assessor can find it without being told. **The
week-5 diagnostic is the evidence and it does not exist yet — it has to be written**, or
these three LOs have no artifact behind them.

CO3's other four outcomes — 3.1, 3.2, 3.5, 3.7 — are still lectured, in 2.3, 2.4 and 2.5.

---

## 2.3–2.7 · The toolchain tour

Every session opens a real file from the Enroll reference app and explains the piece of the
toolchain it belongs to. What survives is the material students have *not* met before: the
dependency list and what each line is for, the types generated from the contract, how a
typed request is made, how to judge a library, and how to know a function works.

**Why it belongs in this milestone.** Two of the tour's three anchor files are produced by
the contract: `schema.d.ts` is generated from it, and `client.ts` is typed by it. Teaching
generated types in the fortnight they are generated turns 2.4 from a TypeScript lesson into
the answer to a question the class has just asked.

**2.5 reads the client; it does not build it.** Building the wrapper — interception, retries,
server state — is lesson 4.2, a week-12 clinic. Reading a finished thing and writing one are
different sessions, and they are now in different milestones.

---

## Laboratory

| Activity | Week | |
|---|---|---|
| **A4** The contract | 5 | group |
| **A5** `package.json` accounting | 6 | |
| **A6** First unit tests | 6 | **the milestone gate** |

A5 and A6 do not exist yet. They are needed by week 6.

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
