# Module 3 — The Stack, End to End · outline

**CSci 153 · Weeks 5–6 · CO3** — *Write valid JavaScript utilizing core programming
paradigms and DOM manipulation*
Syllabus LOs: **LO 3.1** types and structures · **LO 3.2** block scoping (`let`/`const`) ·
**LO 3.3** loop structures · **LO 3.4** functions and arrow expressions ·
**LO 3.5** JSON serialize/deserialize · **LO 3.6** DOM manipulation ·
**LO 3.7** JavaScript libraries

Status: **planning**. Deck not built yet.

> **Delivery note — changed 2026-08-19.** This module was planned as four weeks of
> JavaScript language teaching. It is now delivered as a **guided tour of the reference
> app** (`reference-app/`, the Subject Enrollment system — see `plan/reference-app.md`):
> every session opens a real file from a running codebase and explains the piece of the
> stack it belongs to. The language topics are still taught and still assessed — they are
> the *content* of the tour rather than its organising principle. Nobody gets a lecture on
> `for` loops in the abstract; they meet iteration in the file that renders a subject list.
>
> **Why:** students arrive having had JavaScript in a prior course, and what actually
> blocks them in weeks 10–17 is not syntax — it is not knowing what the twelve things in
> `package.json` are for. Making the stack legible before Module 4 adds to it is
> worth a week and a half; it was never worth four.

### Every LO still has a home

Coverage is unchanged; only the framing moved. Nothing in the OBE syllabus is dropped.

| Syllabus LO | Where it is taught now |
|---|---|
| LO 3.1 types and structures | 3.2, 3.3 — the shapes an API response is made of |
| LO 3.2 block scoping | 3.2 — `let`/`const` as they appear in the app |
| LO 3.3 loop structures | 3.3 — `for…of`, then `map`/`filter`/`reduce` |
| LO 3.4 functions and arrows | 3.4 — arrows, closures, `import`/`export` |
| LO 3.5 JSON serialize/deserialize | 3.5 — `fetch`, `await`, and the wrapper from 2.4 |
| LO 3.6 DOM manipulation | 3.6 — built by hand once, then in React |
| LO 3.7 JavaScript libraries | 3.1, 3.7 — the app's real dependencies, and how to judge one |

---

## Lesson order

One and a half weeks of lecture (3.1 lands in week 5, the rest in week 6). Each session starts in a file that already runs — the reading is lab work and self-study, not lecture time.

| # | Lesson | LO | The file it opens |
|---|---|---|---|
| 3.1 | **The stack, named** | 3.7 | `package.json` |
| 3.2 | **TypeScript in five ideas** | 3.1, 3.2 | `contract/generated/schema.d.ts` |
| 3.3 | **Arrays, objects, iteration** | 3.1, 3.3 | `SubjectList.tsx` |
| 3.4 | **Functions, modules, and where files live** | 3.4 | `src/lib/`, `src/hooks/` |
| 3.5 | **JSON, `fetch`, and `await`** | 3.5 | `src/lib/api/client.ts` |
| 3.6 | **What React does for you** | 3.6 | one list, twice — by hand, then in React |
| 3.7 | **Choosing a library** | 3.7 | the dependency list, judged |
| 3.8 | **Does it work? — briefly** | *(no LO)* | `units.test.ts` |

---

## 3.1 · The stack, named

Open `package.json` and account for **every line**. Twelve dependencies, each with a
one-sentence answer to "what breaks if I remove this?" — and, for each, whether it is a
library you call or a framework that calls you.

The point is orientation, not depth: after this session, no name in the project is a
mystery word. Vite, React, TypeScript, Tailwind, shadcn/ui, TanStack Query,
openapi-fetch, Supabase, Vitest, Playwright, and the two lint tools.

**The exercise:** each group writes the same accounting for *their own* `package.json`,
and has to justify anything they installed that the reference app does not have.

---

## 3.2 · TypeScript in five ideas

Only the TypeScript this course actually writes: annotations, unions, `type` vs
`interface`, optional and nullable, and generics **you only ever read, never write**.

Taught on `contract/generated/schema.d.ts` — the file Module 2 generated from the spec.
It is the ideal specimen because nobody wrote it by hand, so nothing in it is stylistic.

`let` vs `const` (LO 3.2) lands here as a rule with a reason: `const` unless the binding
is reassigned, which in this codebase is almost never.

---

## 3.3 · Arrays, objects, iteration

Every API response in the app is arrays of objects. `for…of` first, because it is the
one that reads like a sentence, then `map` / `filter` / `reduce` — the three React
actually uses — on the enrollment data.

Land one idea hard: **`map` in JSX is a loop.** Students who learned `for` loops as a
statement often do not recognise the list-rendering they have been writing since
Module 2 as iteration at all.

---

## 3.4 · Functions, modules, and where files live

Arrow functions, parameters and returns, and closures — introduced as *the reason hooks
work*, which is the only motivation students find convincing.

Then `import` / `export`, and the folder layout of the reference app: why `lib/` differs
from `hooks/` differs from `components/`, and what "one job per file" buys.

---

## 3.5 · JSON, `fetch`, and `await`

Retroactive explanation of `src/lib/api/client.ts`, which they have been using since
Module 2 without opening. What JSON is and is not, `JSON.parse` / `stringify`, and
`fetch` returning a promise.

`await` shown against the callback version of the same request. **Then the failure
modes:** an `await` nobody awaited, and an error nobody caught — both live, in the
running app, with the mock returning a 500 on purpose.

---

## 3.6 · What React does for you

Build the subject list twice in one session: once with `querySelector`,
`createElement`, and `addEventListener`, and once in React.

The hand-built version is fine for five rows. The lesson is what happens on the sixth,
and on "now remove one" — the bookkeeping React is doing on your behalf. Do this and
nobody asks "why do we need React" again.

This satisfies LO 3.6 honestly rather than as a detour: **React is a DOM-manipulation
library**, and this is the session where that stops being a slogan.

---

## 3.7 · Choosing a library

npm and `node_modules`, semantic versioning and what `^` licenses, lockfiles, and
reading documentation you did not write.

Then a real judgment exercise: three candidate packages for the same job — weekly
downloads, last publish date, open issues, bundle size, whether the types ship with it.
Pick one and defend it. The reference app's own dependency choices are the worked example.

---

## 3.8 · Does it work? — the brief version

**No syllabus LO**, ~1 session. Enough Vitest to not be lost in Module 5: what a unit
test is, `describe` / `it` / `expect`, and testing the unit-ceiling function from the
reference app — a pure function with no UI and no database attached.

Watch it fail first, then pass. Land the rule: **a test that has never failed proves
nothing.**

Defer to Module 5: component tests, Playwright, CI.

---

## Carried forward

- The 12-point QA (8 from Module 1, 4 from Module 2) runs on anything with a UI
- The contract from Module 2 is now something students can *read*, not just generate
- Prompt log continues as a graded artifact
