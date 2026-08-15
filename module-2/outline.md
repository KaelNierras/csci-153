# Module 2 — Frontend Development · outline

**CSci 153 · Weeks 3–5 · CO2** — *Develop responsive web templates using HTML/CSS
frameworks and component libraries*
Syllabus LOs: **LO 2.1** reusable UI components with Next.js + Tailwind ·
**LO 2.2** cross-device responsiveness

Status: **planning**. Deck not built yet.

---

## Lesson order

The sequence is load-bearing — each lesson creates the problem the next one solves.

| # | Lesson | Why it sits here |
|---|---|---|
| 2.1 | **Components from mockups** | Module 1's screen becomes real components; tokens become the Tailwind theme |
| 2.2 | **Auth Context + route protection** | First real cross-cutting state; creates the need for a request layer |
| 2.3 | **The API contract (OpenAPI)** | You cannot type the wrapper until you know the contract |
| 2.4 | **API wrapper + interception** | Built *against* the spec from 2.3, not invented |
| 2.5 | **Data states in practice** | Cashes in Module 1's loading / empty / error work with real latency |

---

## 2.3 · The API contract — the new segment

**Framing:** the frontend is written against a contract *before the backend exists*.
That is the real professional workflow, and in this course it is literally true —
the backend is Module 4, five weeks away.

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
Module 2   consume it     typed wrapper + screens, running against a mock
Module 4   implement it   CRUD endpoints that satisfy the same document
Module 5   integrate      swap the mock for the real base URL — nothing else changes
```

Module 4 then has a real acceptance criterion: *does your implementation satisfy the
contract the frontend was already written against?*

**To prepare:** author `enrollment-api.yaml` — 5 or 6 operations (list subjects, get
load, add subject, remove subject, submit enrollment) with error responses that
actually appear in the UI. Ship it in `Module 2/` and reuse the same file in 4 and 5.

---

## Carried forward from Module 1

- The 8-point design QA runs on every generated screen, all semester
- Tokens become `tailwind.config` theme values — same three layers
- Loading / empty / error states are now built against real latency
- Prompt log continues as a graded artifact
