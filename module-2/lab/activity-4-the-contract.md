# Laboratory Activity 4 — The Contract

**CSci 153 · Web Systems and Technologies**
Module 2 · Lessons 2.3–2.5 · Week 5 · Assessment task **CA 4**
Course outcome **CO2** · Learning outcome **LO 2.1, LO 2.2**

> ### This one is a group activity — with individually graded parts
>
> | | Produced by | Why |
> |---|---|---|
> | **`contract/openapi.yaml`** | **The group — one file** | It is an agreement. An agreement written by one person is not one. |
> | **Generated client and wrapper** | **The group — one setup** | Derived from the contract; there is only one of it. |
> | **Your screen, wired to the client** | **Each member, individually** | Each of you connects the screen you built in Activity 3. |
> | **Decision log** | **The group** | Where the actual thinking is visible. |
>
> **Every member must appear in the commit history of `contract/openapi.yaml`.** An
> eight-operation spec authored entirely by one person is a fail for the whole group,
> however good the spec is. Split it by operation and review each other's.

---

## Scenario

You are going to write the document that Module 4 has to implement and Module 5 has to
connect to. It is the only artifact in this course that touches three modules.

Your backend does not exist. It is seven weeks away, and the people who will build it
are you. That is precisely why the shapes have to be written down now — while changing
them costs a text edit rather than a rewrite.

> **You will get parts of this wrong, and that is expected.** You are specifying data
> shapes before Module 4 teaches you to model data. Week-10 breaking changes are the
> method working, not you failing. What is *not* acceptable is discovering in week 13
> that nobody ever decided what a failed request looks like.

---

## What you submit

### 1 · `contract/openapi.yaml` — **group**

OpenAPI **3.1**, covering the core flows of your group's assigned system.

**Requirements**

- **At least eight operations**, covering the flows your system cannot demonstrate
  without: at minimum one list with filtering, one detail read, one create, one update
  or state change, and one delete or terminal action.
- Every operation has a **stable `operationId`** in camelCase. These become your client
  method names and your TanStack Query keys, so name them as though you will type them
  a hundred times, because you will.
- **Shared schemas** in `components.schemas`, referenced with `$ref`. If your system's
  main entity is written out twice, that is a finding.
- **A single documented error shape**, referenced by every failure response.
- **Every response your UI must render** — not only the happy path. The 404, the 409,
  the 422, the 429 if you have one. If it is not in the spec, your UI has no defined
  behaviour for it.
- `security` declared once globally, with genuinely public operations opting out
  explicitly.
- Operations grouped with tags matching your system's portals, so Redoc's sidebar
  mirrors your app.
- **Passes `npx redocly lint contract/openapi.yaml` with zero errors.**

### 2 · Generated client and wrapper — **group**

```bash
npx openapi-typescript contract/openapi.yaml -o contract/generated/schema.d.ts
```

- `contract/generated/` **committed** — a fresh clone must type-check without network
  access.
- An `openapi-fetch` client in `src/lib/api/`, typed with the generated `paths`.
- Interception for: attaching the auth token, normalising errors into the contract's
  error shape, and handling 401 globally.
- The base URL comes from an environment variable. **This is the one line that changes
  in Module 5** — treat it accordingly.

### 3 · Two screens running against a mock — **individual**

Each member wires **their own Activity 3 screen** to the typed client via TanStack
Query, running against a mock of your contract (Prism or MSW — your group's choice,
stated in the decision log).

**Requirements per screen**

- Data fetched through the generated client. **No hand-written fetch calls, no
  hand-written response interfaces.**
- Query keys derived from `operationId` plus parameters.
- At least one mutation, with correct invalidation afterwards.
- Every documented error response for the operations you call is rendered as a designed
  state — including at least one you can trigger on demand from the mock.

### 4 · Redoc, published — **group**

Your spec rendered and reachable by everyone in the group. Either the in-app `/docs`
route or a static bundle:

```bash
npx @redocly/cli build-docs contract/openapi.yaml -o docs/index.html
```

### 5 · Decision log (`contract/DECISIONS.md`) — **group**

**Three decisions your group genuinely argued about**, each in four lines: what the
question was, the options, what you chose, and why. Real candidates:

- Do we return `404` or an empty list when a filter matches nothing?
- Is the identifier `id`, or the human-readable one the registrar uses?
- Do we nest the response in `{ data: … }` or return the object directly?
- Does deleting something that is already deleted fail, or succeed silently?
- Is the timestamp a date or a date-time, and in whose timezone?

A log of three decisions nobody disagreed about earns nothing. **The disagreement is
the evidence of thinking**, so write down what the losing option was.

---

## Submission

- **Where** — the group repository, plus one zip per member on the VSU E-Learning
  Portal: `SURNAME_A4.zip` containing `DECISIONS.md` (group copy) and your own
  `prompt-log.md`
- **When** — before the start of the week 6 session
- **What must be in the repository** — `contract/openapi.yaml`, `contract/generated/`,
  `contract/DECISIONS.md`, the API client, and each member's wired screen, all merged
  to `main` through reviewed pull requests

---

## Rubric — 100 points

**Group portion — 60 points, same mark for every member**

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Contract completeness** | 20 | Eight or more operations covering the real flows. Every response the UI needs, including failures. Shared schemas, no duplication. |
| **Contract quality** | 15 | Lints clean. Stable camelCase `operationId`s. One error shape used everywhere. Naming consistent enough that a stranger could predict the next operation's name. |
| **Client generation and wrapper** | 10 | Generated types committed and fresh. Typed client with interception. Base URL configurable. Nothing hand-mirrors the server. |
| **Redoc published** | 5 | Reachable and current with the committed spec. |
| **Decision log** | 10 | Three real disagreements, with the rejected option named and the reasoning stated. |

**Individual portion — 40 points**

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Screen wired correctly** | 15 | All data through the generated client. Query keys from `operationId`. No hand-written response types. |
| **Mutation and invalidation** | 10 | A mutation that invalidates exactly the right keys — not everything, not nothing. |
| **Error states rendered** | 10 | Every documented failure for your operations has a designed state, demonstrable against the mock. |
| **Contribution to the contract** | 5 | Your commits are in `contract/openapi.yaml`'s history and you reviewed someone else's. |

**Automatic deductions**

- `contract/generated/` edited by hand — **−20** (it is generated; the fix is to change the spec)
- A hand-written interface mirroring a response shape — **−10 each**, maximum −20
- `redocly lint` errors — **−10**
- A contract-touching pull request merged without approval from the other side — **−10**
- A member with no commits in the contract's history — **−15 for that member**
- Only the happy path specified for an operation the UI calls — **−5 each**, maximum −15

---

## Where this goes next

| Feeds into | How |
|---|---|
| **Module 3 · JavaScript** | What `await` was doing inside your wrapper, what JSON actually is, and how to unit-test the functions you have started writing. |
| **Module 4 · Backend** | The other side. Your schema, RLS policies, and functions must satisfy **this document** — `npm run contract:check` passing is what "done" means. |
| **Module 5 · Integration** | Swap the mock base URL for the real one. If the contract held, nothing else changes. That is the whole bet. |
| **Final Project (FP, 20%)** | Group. This spec is the spine of it. |

---

## Checklist before you upload

- [ ] Eight or more operations, every one with a stable camelCase `operationId`
- [ ] Shared schemas in `components.schemas`, referenced with `$ref`
- [ ] One error shape, referenced by every failure response
- [ ] Every response your UI renders is documented — including the failures
- [ ] `npx redocly lint contract/openapi.yaml` exits clean
- [ ] `contract/generated/` committed and regenerated from the current spec
- [ ] Typed client with auth, error normalisation, and configurable base URL
- [ ] Two members' screens fetch through it, with correct query keys
- [ ] At least one mutation invalidates exactly the right keys
- [ ] Redoc reachable by the whole group
- [ ] `DECISIONS.md` records three real disagreements
- [ ] **Every member has commits in the contract's history**
