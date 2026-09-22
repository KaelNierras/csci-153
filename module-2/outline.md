# Module 2 — Frontend Development · outline

**CSci 153 · Weeks 3 and 4, plus clinics in weeks 11–12 · CO2** — *Develop responsive web templates using HTML/CSS
frameworks and component libraries*
Syllabus LOs: **LO 2.1** reusable UI components with React + Tailwind ·
**LO 2.2** cross-device responsiveness

> **Framework note.** LO 2.1 is worded "Next.js + Tailwind" in the OBE syllabus; this
> course delivers it with **React (Vite) + Tailwind + shadcn/ui**. React and
> Shadcn/React are both named in the syllabus reference list, and the learning
> outcome — reusable, responsive components from a design system — is framework-
> agnostic. Dropping the server framework also keeps the frontend/backend boundary
> a *contract* rather than a blurred one, which is what lesson 2.3 is built on.
> The Final Activity Project specs use this same stack.

Status: **planning**. Deck not built yet.

### Prior knowledge — what this module does *not* re-teach

React fundamentals — components, props, state, `useState`/`useEffect`, lists and keys —
were covered in the previous course. Module 2 does not repeat them. Lesson 2.1 is a
bridge, not an introduction: it assumes you can already write a component and spends
its time on *what to build* and *how to structure it*, not on syntax.

If React is genuinely rusty, that is a self-study gap to close in week 3, not class
time. Say so early rather than in week 5.

> ## ⬛ Delivery — this module is split across three milestones
>
> Resequenced 2026-09-22 (`../plan/milestones.md`). Module 2 is the one deck that is not
> delivered in one sitting, because its lessons belong to three different stages of a build.
>
> | Lesson | Milestone | When |
> |---|---|---|
> | 2.0 Git & GitHub | **1 · UI/UX** | Week 3 |
> | 2.1 Components from mockups | **1 · UI/UX** | Week 3 |
> | 2.3 The API contract (OpenAPI) | **2 · Contract** | Week 4 |
> | 2.2 Auth Context + route protection | **4 · Frontend** | Week 11 clinic, ~45 min |
> | 2.4 API wrapper, interception, server state | **4 · Frontend** | Week 12 clinic, ~60 min |
> | 2.5 Data states in practice | **4 · Frontend** | Week 12 clinic, ~60 min |
>
> **The lesson order below is still the order to read them in** — each lesson still creates
> the problem the next one solves. What changed is that the gap between 2.1 and 2.2 is now
> eight weeks of contract and backend work, and by the time 2.2 runs there is a real session
> to protect a route with.
>
> **LO retag.** LO 2.2 (cross-device responsiveness) moved from lesson 2.5 to lesson 2.1,
> where responsiveness is actually built. Both of CO2's outcomes are therefore attained in
> week 3 and assessed by A3 in week 4. Everything that moved into the dev phase carries no
> syllabus LO.

---

## Lesson order

The sequence is load-bearing — each lesson creates the problem the next one solves.

| # | Lesson | Milestone · week | Why it sits here |
|---|---|---|---|
| 2.0 | **Git & GitHub — briefly** | 1 · W3 | ~1 session. The group workflow the Final Activity Project runs on |
| 2.1 | **Components from mockups** | 1 · W3 | Module 1's screen becomes real components; tokens become the Tailwind theme. React itself is assumed. **LO 2.1 and LO 2.2** |
| 2.3 | **The API contract (OpenAPI)** | 2 · W4 | Taught the same block as data modeling (4.1) — you model what exists, then write down how it is exposed |
| 2.2 | **Auth Context + route protection** | 4 · W11 | First real cross-cutting state. Now taught when there is a real session to protect a route with |
| 2.4 | **API wrapper, interception, and server state** | 4 · W12 | Built *against* the spec, not invented. TanStack Query enters here |
| 2.5 | **Data states in practice** | 4 · W12 | Cashes in Module 1's loading / empty / error work with real latency |

The rows are in **delivery order**, which is no longer numeric order. The numbering is
kept because the deck's slides and the activity briefs refer to it.

---

## 2.0 · Git & GitHub — the brief version

**Not covered by any syllabus LO**, and deliberately short: one session, practical only.
The Final Activity Project is group work in a shared repository, so this is the minimum
that keeps a group from stepping on itself — not a course in version control.

Cover, quickly: branch per feature · commit messages that name the change · pull request
with one required approval · issues and milestones as the work queue · what a merge
conflict is and how not to panic. Demonstrate a conflict live and resolve it once.

Skip entirely: rebasing, cherry-picking, submodules, git internals. If a group needs
those, they can ask.

**Assessment hook:** every group member must have commits by the end of Module 2. This
is also how individual contribution to a group project is evidenced later.

---

## 2.4 · Server state — the addition

TanStack Query belongs here rather than in its own lesson, because it only makes sense
once the wrapper exists. The point to land: **server data is not component state.** It
is a cache of something that lives elsewhere, and it goes stale.

Query keys derive from the contract's `operationId` plus its parameters, which makes
invalidation-after-mutation mechanical instead of guesswork. Contrast this against
Context, taught in 2.2: Context is for state the client owns (session, theme, the
record being edited); Query is for state the server owns. Students who blur the two
end up copying fetched data into Context and then hand-syncing it — worth showing that
failure once, on purpose.

---

## 2.3 · The API contract — the new segment

**Framing:** the contract is agreed *before either side is built*. That is the real
professional workflow, and in this course it is literally true — the backend is
Milestone 3, three weeks away, and the frontend wiring is Milestone 4, seven.

**Say the cost out loud.** The gap used to be five weeks, which made the argument for
contract-first by itself. It is now shorter, so a group could reasonably ask why they
should not just wait for the backend. The answer is the week-6 gate: running screens on
the Prism mock. A group that waited has nothing to show.

### Slides (~10)

1. **Integration day** — what goes wrong when FE and BE are built from separate
   assumptions. The field is called `student_id`, or is it `studentId`, or `id`?
2. **What a contract is** — every request and response shape, agreed and written
   down, before either side is built
3. **OpenAPI in three minutes** — `paths` → operation → `parameters` /
   `requestBody` → `responses` → `components.schemas`
4. **Reading a real spec** — *interactive: mini spec explorer*
5. **Contract-first vs code-first** — which you are doing, and why contract-first
   is what lets two people work in parallel
6. **Generated types, never hand-written** — `openapi-typescript` produces the
   interfaces; hand-written mirrors of the server drift silently
7. **The same idea, twice** — `supabase gen types typescript` in Module 4 is this
   exact pattern: schema is truth, types are a downstream artifact. Introduce the
   principle here so Module 4 is a recognition, not a new topic
8. **Mocking the contract** — Prism or MSW, so the UI runs today against a spec
   whose implementation does not exist yet
9. **Breaking vs additive change** — *interactive: contract diff with a verdict* —
   why the spec is the thing you review, not the implementation
10. **Agentic angle** — pasting the spec into context is the single
    highest-leverage thing you can hand the agent: it produces correct fetch calls,
    correct types, and correct error handling because the shape is no longer a guess

### Interactive instruments

- **Spec explorer** — small enrollment-API YAML on the left; expanding an operation
  shows the typed request and response on the right. A stripped, teachable
  Swagger UI in the deck's own visual language.
- **Schema → type** — an OpenAPI schema object beside its generated TypeScript
  interface, updating live as fields are toggled required / optional / nullable.
- **Contract diff** — toggle v1 → v2 of the spec; each change is labeled
  *additive* or *breaking*, with a verdict line.

---

## The spec is the spine of the semester

One OpenAPI document, carried across three modules. This is what makes the course
hold together rather than being five unrelated units.

```
Milestone 2   agree it       a data model, then openapi.yaml, then generated types
Milestone 3   implement it   schema, RLS, and endpoints that satisfy that document
Milestone 4   consume it     typed wrapper and screens, then the real base URL
```

Milestone 3 then has a real acceptance criterion: *does your implementation satisfy the
contract you agreed two weeks ago?* — and Milestone 4 has a guarantee: if the backend
satisfies the contract, the screens the mock was built against will work against it.

**To prepare:** author `enrollment-api.yaml` — 5 or 6 operations (list subjects, get
load, add subject, remove subject, submit enrollment) with error responses that
actually appear in the UI. Ship it in `Module 2/` and reuse the same file in 4 and 5.

---

## Carried forward from Module 1

- The 8-point design QA runs on every generated screen, all semester
- Tokens become `tailwind.config` theme values — same three layers
- Loading / empty / error states are now built against real latency
- Prompt log continues as a graded artifact
