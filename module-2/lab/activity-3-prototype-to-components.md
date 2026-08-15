# Laboratory Activity 3 — Prototype to Components

**CSci 153 · Web Systems and Technologies**
Module 2 · Lessons 2.1–2.2 · Week 4 · Assessment task **CA 3**
Course outcome **CO2** · Learning outcome **LO 2.1**

> ### This one is individual
>
> You rebuild **your own** Activity 2 screen — the one you claimed and nobody else in
> your group took. Your group shares a token set and a repository; the components in
> this activity are yours.
>
> [Activity 4](./activity-4-the-contract.md), next week, is the group one.

---

## Scenario

In Activity 2 you produced `final.html` — one self-contained file, reviewed against
the 8-point QA, with the states drawn in. It works, and it is unmaintainable.

Now it becomes real: typed components, a session context, a guarded route, and four
data states that actually occur because the data arrives over a network that is
sometimes slow and sometimes broken.

There is still no backend. You will run against a mock, which is the point.

> **Reuse the screen you already designed.** This is not a redesign. If your Activity 2
> screen was weak, fix what the feedback said and move on — the marks here are for
> structure, not for a second visual pass.

---

## Setup

Your group has one repository. Work on a branch, open a pull request, get one approval.

```bash
git checkout main && git pull
git checkout -b feature/<issue>-<your-screen>
npm install
npm run dev
```

**Commit messages follow [Conventional Commits](https://www.conventionalcommits.org)**,
as taught in Lesson 2.0 — `type(scope): imperative description`:

```
feat(student-card): add loading and empty states
fix(session): handle the resolving branch in the route guard
refactor(api): extract the error normaliser
```

If your group has not scaffolded the project yet, the first person to reach this step
does it and pushes to `main`: Vite + React + TypeScript, Tailwind, React Router,
TanStack Query. Everyone else pulls. **Do not create four separate projects.**

---

## What you submit

Everything lives in the group repository. The submission is a **pull request**, plus a
short document.

### 1 · The screen, as components

At least **four** components with typed props, in `src/components/`.

**Constraints**

- Every component's props are a named TypeScript type. No `any`, no untyped
  destructuring.
- No hard-coded colour, spacing, or font-size values. Tailwind classes bound to your
  group's theme, or nothing.
- No component library for the components that carry your design. Use shadcn/ui for
  generic primitives (dialog, dropdown, toast) if you need them.
- The screen still passes the 8-point QA from Module 1.

### 2 · Boundary justification (`boundaries.md`)

For each component, **one sentence** naming which criterion from Lesson 2.1 justifies
its existence:

> `SubjectRow` — appears in the load table and the search results, and has its own
> disabled state when the subject is full.

A component justified only by "the file was getting long" earns nothing for that row.
If you extracted something and cannot justify it, the honest move is to inline it again
and say so.

### 3 · `SessionContext` and a guarded route

- A provider holding `{ session, profile, role, status }`.
- A `useSession()` hook that **throws** when called outside the provider.
- The context value memoised with `useMemo`.
- A `RequireAuth` or `RequireRole` wrapper that handles all three cases: still
  resolving, signed out, and wrong role.

The session can be faked for this activity — a hard-coded profile behind a
"sign in as…" switcher is fine. **The shape and the wiring are what is graded**, not
real authentication, which arrives in Module 4.

### 4 · Four data states, reachable

Loading, empty, error, and content — all four visible in the running app, not merely
written in the code. Include the switch you used to force each one (a query parameter,
a devtools toggle, a mock handler) in your pull request description so a reviewer can
reproduce them.

Throttle to **Slow 3G** and confirm the loading state is actually visible and the
layout does not jump when data lands.

### 5 · Prompt log (`prompt-log.md`)

Continues as a graded artifact, same rules as Module 1:

- The brief you gave the agent, including the props you had already decided
- The plan it proposed, and your corrections
- **At least one error it made that you caught**, with the correction you sent
- What you rejected, and why

A log that reads as though it were written after the code is worth zero, and is
referred to the integrity policy.

---

## Submission

- **Where** — a pull request in your group's repository, plus `SURNAME_A3.zip` on the
  VSU E-Learning Portal containing `boundaries.md` and `prompt-log.md`
- **When** — before the start of the week 5 session
- **The pull request must** — reference its issue, describe what changed, list how to
  reach each data state, and carry **one approval** from a groupmate

---

## Rubric — 100 points

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Boundary judgment** | 25 | Every component is justified by a real criterion. Nothing extracted for length; nothing left inline that has four states of its own. |
| **Props as contracts** | 20 | Named types throughout. No `any`. Optional versus required is a deliberate choice, and composition is used instead of a pile of boolean props. |
| **Context correctness** | 20 | One narrow context, memoised value, hook that throws, guard that handles the loading case. No server data copied into context. |
| **States and responsiveness** | 20 | All four states reachable and designed. No layout shift. Holds at 320px and at 200% zoom. |
| **Token discipline** | 10 | Theme bound to the group's tokens; zero hard-coded values in components. |
| **Prompt log** | 5 | A real plan → review → iterate cycle with at least one caught error. |

**Automatic deductions**

- Any hard-coded hex, px font-size, or off-scale spacing in a component — **−5 each**, maximum −15
- Missing or removed focus states — **−10**
- `any` in a props type — **−5 each**, maximum −15
- A guard with no loading branch (bounces a signed-in user to `/login` on refresh) — **−8**
- Server data copied from a query into context — **−10**
- Pull request merged without a groupmate's approval — **−10**
- Commit messages not in Conventional Commits form — **−2 each**, maximum −10

---

## Where this goes next

| Feeds into | How |
|---|---|
| **Activity 4 · next week** | These components stop using mock data and start calling your group's typed client, against the contract you will write. |
| **Module 4 · Backend** | `SessionContext` gets a real Supabase session, and the guard's advisory check gets a real enforcement layer behind it in RLS. |
| **Practical Exam (PE, 15%)** | Individual. You will defend these boundaries out loud — which is why the justification document exists. |

---

## Checklist before you upload

- [ ] Four or more components, every one with a named props type
- [ ] `boundaries.md` justifies each against a Lesson 2.1 criterion
- [ ] Zero hard-coded colour or spacing values in any component
- [ ] `useSession()` throws outside its provider
- [ ] Context value is memoised
- [ ] Guard handles loading, signed-out, and wrong-role
- [ ] All four data states reachable in the running app
- [ ] Checked at Slow 3G — loading visible, no layout jump
- [ ] Checked at 320px and 200% zoom
- [ ] Every commit message is `type(scope): description`, imperative mood
- [ ] Pull request references its issue and has one approval
- [ ] Prompt log contains a real correction you made
