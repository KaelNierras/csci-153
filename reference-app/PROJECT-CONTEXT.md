# Project Context — Enroll (CSci 153 reference app)

> **What this file is for.** Paste it into an agent at the start of any session that
> touches the reference app. It states what the app is, what it must demonstrate, the
> stack, the domain rules, the conventions, and — importantly — **what must not be built
> yet**. An agent given this file plus `contract/openapi.yaml` should not have to guess
> anything.
>
> Keep it current. When a decision changes, change it here first; this file is the truth
> and the code is downstream of it.
>
> **The app lives in its own repository**, at `../csci-153-enroll` — separate from the
> course site so a Vite project's `node_modules` never reaches the Pages build. This file
> is mirrored there as `PROJECT-CONTEXT.md`, and **that copy is the one to edit**, since it
> ships with the code it describes. Sync changes back here afterwards.

---

## 1 · What this is

**Enroll** — a Subject Enrollment system, built by the instructor as the worked example
for CSci 153. It is the app opened on the projector in every module, and the codebase
Module 3 is a guided tour of.

- **Audience:** second-year students who have had one prior programming course.
- **Read by students, not submitted by them.** Each group ships its own system
  (SPMIS / SAAIS / EIRMIS). Enroll is deliberately a *different* domain, close enough
  that every pattern transfers and far enough that none of it can be handed in.
- **Explained, not built live.** Discussion sessions open real files from this app and
  explain why they are shaped that way. There is no live coding in lecture, so the app is
  **finished before the semester starts** and its **git history is a teaching artifact** —
  one commit per idea, messages written to be read out loud on a projector.
- **Size ceiling:** 9 API operations, 6 screens, 2 roles. If it grows past that, cut
  something. A demo nobody can read in one sitting has stopped being a teaching tool.

### The two rules that govern every decision

1. **Enroll exists to demonstrate exactly what the modules teach, in the order they teach
   it.** Nothing is in the codebase because it is good practice in general; everything is
   there because a specific lesson points at it. If a feature does not have a lesson, it
   does not get built.
2. **The history is part of the product.** Build in module order and commit at the
   granularity you would *explain*, not the granularity that is convenient. A commit
   carrying three ideas cannot be read out loud, and a careless history cannot be made
   careful later.

---

## 2 · Domain

### Entities

| Entity | Fields that matter |
|---|---|
| **Term** | `code` (`2026-1`), `isActive` — exactly one active term |
| **Subject** | `id`, `code` (`CSci 153`), `title`, `units`, `schedule`, `capacity`, `enrolledCount` |
| **Student** | `id`, `studentNo`, `fullName`, `program`, `yearLevel`, `adviserId` |
| **Enrollment** | `id`, `studentId`, `term`, `status`, `totalUnits`, `submittedAt`, `returnedReason` |
| **EnrollmentItem** | `enrollmentId`, `subjectId` — the join, one row per chosen subject |

`Enrollment.status` is the state machine: `draft` → `submitted` → `approved`, with
`submitted` → `returned` → `draft` as the loop back.

### Roles

- **student** — sees and edits only their own enrollment.
- **adviser** — sees the submitted enrollments of their own advisees; approves or returns.

No admin role. Term setup and subject offerings are seed data, not screens.

### Business rules (these are the rules every layer enforces)

| # | Rule | Violation |
|---|---|---|
| R1 | One enrollment per student per term | `409 ENROLLMENT_EXISTS` |
| R2 | Total units ≤ **21** | `422 UNIT_CEILING` |
| R3 | A subject appears at most once in an enrollment | `409 DUPLICATE_SUBJECT` |
| R4 | A subject at capacity cannot be added | `409 SUBJECT_FULL` |
| R5 | Only a `draft` enrollment can be modified | `409 NOT_EDITABLE` |
| R6 | Submitting requires ≥ 1 subject | `422 EMPTY_ENROLLMENT` |
| R7 | A student may read/write only their own enrollment | `403 FORBIDDEN` |
| R8 | An adviser may act only on their own advisees | `403 FORBIDDEN` |
| R9 | Returning an enrollment requires a reason (≥ 10 chars) | `422 REASON_REQUIRED` |

**R2, R3, R4 are enforced twice on purpose** — in the UI (Module 2) and in the database
(Module 4). That duplication is itself a lesson: the client check is for usability, the
server check is the one that counts. Do not remove either.

### Error shape — one shape, everywhere

```json
{ "code": "UNIT_CEILING", "message": "Adding CSci 153 would put you at 24 units. The limit is 21.", "details": { "attempted": 24, "limit": 21 } }
```

`code` is for the UI to branch on, `message` is shown to the user as-is, `details` is
optional and for the UI to render specifics. Every documented response in the contract
uses this shape for every non-2xx status.

---

## 3 · The contract

`contract/openapi.yaml` is the source of truth for the whole app. Nine operations:

| `operationId` | Method & path | Notes |
|---|---|---|
| `getCurrentTerm` | `GET /terms/current` | |
| `listSubjects` | `GET /subjects?term&q&page` | search + paging |
| `getStudentEnrollment` | `GET /students/{studentId}/enrollment?term` | the student's load |
| `addEnrollmentItem` | `POST /students/{studentId}/enrollment/items` | R2, R3, R4, R5 |
| `removeEnrollmentItem` | `DELETE /students/{studentId}/enrollment/items/{subjectId}` | R5 |
| `submitEnrollment` | `POST /students/{studentId}/enrollment/submit` | R5, R6 |
| `listPendingEnrollments` | `GET /advisees/enrollments?status` | adviser, R8 |
| `approveEnrollment` | `POST /enrollments/{id}/approve` | adviser, R8 |
| `returnEnrollment` | `POST /enrollments/{id}/return` | adviser, R8, R9 |

Rules for the contract:

- **Never add an operation that is not on this list** without updating this file first.
- Every operation documents its error responses, not just the happy path.
- Shared shapes live in `components.schemas` and are `$ref`'d — a `Subject` is a
  `Subject` everywhere.
- `redocly lint` must pass clean before a commit.
- TypeScript types are **generated** (`openapi-typescript`) into
  `contract/generated/schema.d.ts` and committed. **Never hand-edit a generated file.**
  Never hand-write an interface that mirrors the server.

---

## 4 · Screens

Six. Each one exists because a lesson needs it.

| Screen | Route | Demonstrates |
|---|---|---|
| Sign in | `/login` | the only unguarded route |
| Subject catalog | `/subjects` | list + search, loading skeleton, empty-on-no-match, add with 409/422 handling |
| My enrollment | `/enrollment` | the load, running unit total, remove, submit, all four data states |
| Enrollment status | `/enrollment/status` | `submitted` / `approved` / `returned` with the reason shown |
| Adviser queue | `/advising` | a role-guarded route, a server-owned list two people can change at once |
| Adviser review | `/advising/{id}` | approve / return, mutation + cache invalidation |

Every screen must pass the **12-point QA** (8 from Module 1, 4 added in Module 2). The
four from Module 2: every documented response renders, no layout shift when data lands,
usable throttled to Slow 3G, no hand-written API shape.

---

## 5 · Stack

Exactly the stack the Final Activity Project specs require. No additions — a dependency
students do not need is a dependency that confuses them.

| Layer | Choice | Why it is here |
|---|---|---|
| Build | **Vite** | fast, no server framework, keeps the FE/BE boundary a contract |
| UI | **React 19** + TypeScript | prior knowledge, assumed in Module 2 |
| Styling | **Tailwind** + CSS-variable tokens | Module 1's tokens become the theme |
| Components | **shadcn/ui** | copied in, owned locally, themed by our tokens |
| Routing | **React Router** | route guards in 2.2 |
| Server state | **TanStack Query** | the cache/invalidation story in 2.4 |
| HTTP | **openapi-fetch** + `openapi-typescript` | typed against the contract |
| Mock (M2–M3) | **Prism** for dev, **MSW** for tests | the app runs before the backend exists |
| Backend (M4) | **Supabase** — Postgres, RLS, Edge Functions | the other side of the contract |
| Unit tests | **Vitest** | Module 3.8 |
| E2E | **Playwright** | Module 5.3 |
| CI | **GitHub Actions** | Module 5.4 |

---

## 6 · Repo layout

```
reference-app/
├─ contract/
│  ├─ openapi.yaml            ← source of truth
│  └─ generated/schema.d.ts   ← generated, committed, never edited
├─ src/
│  ├─ components/
│  │  ├─ ui/                  ← shadcn, copied in
│  │  └─ …                    ← ours: SubjectRow, UnitMeter, EnrollmentTable…
│  ├─ features/
│  │  ├─ enrollment/          ← screens + hooks for one feature, together
│  │  └─ advising/
│  ├─ hooks/                  ← cross-feature hooks
│  ├─ lib/
│  │  ├─ api/client.ts        ← the one wrapper: auth, error normalising, 401
│  │  └─ rules/units.ts       ← pure functions; the Vitest specimen
│  ├─ context/SessionContext.tsx
│  └─ styles/tokens.css       ← Module 1 tokens, one place
├─ demos/
│  └─ subject-list-vanilla.html  ← Module 3.6, the by-hand DOM twin
├─ supabase/                  ← Module 4: migrations, policies, functions
├─ e2e/                       ← Module 5: Playwright
└─ .github/workflows/ci.yml   ← Module 5
```

Conventions that matter:

- **One job per file.** A file students cannot summarise in a sentence is too big.
- `lib/` is framework-free — pure functions and the client. No JSX in `lib/`.
- Business rules live in `lib/rules/` as pure functions so they are testable and so
  Module 3.8 has something honest to test.
- **No hard-coded colour anywhere.** `bg-surface`, `text-accent`, never a hex.
- Query keys are `[operationId, ...params]` — derived from the contract, never invented.

---

## 7 · What exists when — do not build ahead

The whole app is built before the semester, so this table is **not** a schedule — it is the
narrative map. It says which layer belongs to which module's explanation, and therefore
which phase of the build a change belongs in and what must not have existed yet *at that
point in the history*. Building Supabase code into the Module 2 stretch of the history
makes the Module 2 sessions unexplainable.

| Module | Explained in | The layer it owns | What must not exist yet at that point |
|---|---|---|---|
| **2** | 3–5 | contract, components, SessionContext, route guards, typed client, TanStack Query, all data states — **running entirely on the Prism mock** | any database, any Supabase code, any real auth |
| **3** | 5–6 | **no new features.** The app is the specimen. Adds `demos/subject-list-vanilla.html`, the annotated `package.json`, and the first Vitest tests | new screens, new operations |
| **4** | 7–8 | Supabase schema + migrations, RLS policies, constraints and a trigger for R2, an Edge Function for `submitEnrollment`, generated DB types | Playwright, CI, deployment |
| **5** | 8 + clinics | validation pass, swap mock → real base URL (one env var), Playwright e2e, GitHub Actions, deploy | — |
| — | 10–17 | **nothing.** The app is frozen and serves as the reference groups compare against | any feature added to match what a group built |

Practically: when you ask an agent for a change, say which phase of the history it belongs
to. "This is Phase 1, the app has no database yet" is the sentence that keeps the narrative
intact.

The Module 4 handover is a **teaching moment, not a mistake**: the week-5 contract will
need changes once real schema modeling is taught. Version it (`feat(contract)!: …`), do
not quietly rewrite it. The diff between contract v1 and v2 is a lesson in Module 4.7 —
and the groups hit the same wall in sprint 1, two weeks later.

---

## 8 · Conventions

- **Commits: Conventional Commits.** `type(scope): imperative description` — `feat`,
  `fix`, `docs`, `refactor`, `test`, `style`, `chore`. Lower case, no full stop, under
  ~70 chars, detail in the body. A breaking change takes `!` before the colon.
- **Branches:** `feature/<issue>-<slug>`, one issue per branch, PR with one approval.
- **Every commit in this repo is teaching material.** The history gets read on the
  projector, so the log has to be exemplary rather than merely functional. One idea per
  commit. If a message needs "and", it is two commits.
- **Generated files are committed** (`contract/generated/`, Supabase types) so CI can
  fail when they go stale.

---

## 9 · Non-goals

Explicitly out of scope, so an agent never adds them "helpfully":

- Payments, printing, PDF export, email or SMS notifications
- Admin CRUD for terms, subjects, or programs — seed data only
- File uploads and avatars
- Real-time subscriptions, optimistic updates, offline support
- Internationalisation, multi-tenancy, audit trails
- A second adviser tier, department-level approvals, or any second approval hop
- Anything that would make the app impressive rather than legible

---

## 10 · Prompting notes

When working on this app with an agent:

1. Paste **this file** and **`contract/openapi.yaml`**. The contract removes the biggest
   source of invention — what shape is the data.
2. **Say which module you are in**, not which week — the two no longer line up. Otherwise
   the agent will happily add Supabase while you are still demonstrating the mock, and the
   demo stops matching the lesson.
3. Ask for the operation by its `operationId`. "Implement `addEnrollmentItem` handling
   every documented response" beats "add a subject to the enrollment".
4. Name the rule IDs (R2, R4) rather than restating them — they are defined here, and
   restating invites drift.
5. **Log the failures.** Where the agent produced wrong code *with* this context, the
   fault is usually this file or the contract being unclear. That is a finding worth
   fixing here, and a slide worth showing.
