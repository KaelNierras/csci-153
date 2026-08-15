# Module 3 — JavaScript Programming · outline

**CSci 153 · Weeks 5–8 · CO3** — *Write valid JavaScript utilizing core programming
paradigms and DOM manipulation*
Syllabus LOs: **LO 3.1** types and structures · **LO 3.2** block scoping (`let`/`const`) ·
**LO 3.3** loop structures · **LO 3.4** functions and arrow expressions ·
**LO 3.5** JSON serialize/deserialize · **LO 3.6** DOM manipulation ·
**LO 3.7** JavaScript libraries

Status: **planning**. Deck not built yet.

This is the longest module (4 weeks) and the only one where the Final Activity Project
is not being actively built. Use that: it is the natural home for the one uncovered
topic that needs a real home rather than a mention — **testing**.

---

## Lesson order

| # | Lesson | Syllabus LO | Why it sits here |
|---|---|---|---|
| 3.1 | **Types, values, and structures** | 3.1 | Arrays and objects are what every API response is made of |
| 3.2 | **Scope, `let`/`const`, and modern syntax** | 3.2 | Destructuring, spread, optional chaining — the syntax the rest of the course writes in |
| 3.3 | **Iteration** | 3.3 | `for…of` first, then `map`/`filter`/`reduce` — the ones React actually uses |
| 3.4 | **Functions, arrows, and modules** | 3.4 | Closures explain hooks; `import`/`export` explains project structure |
| 3.5 | **JSON and async** | 3.5 | `fetch`, promises, `async`/`await` — what the Module 2 wrapper was doing |
| 3.6 | **The DOM, directly** | 3.6 | Deliberately *without* React, so the framework stops being magic |
| 3.7 | **Using libraries** | 3.7 | npm, semantic versioning, reading docs, evaluating a package |
| 3.8 | **Does it actually work? — briefly** | *(no LO)* | Unit testing with Vitest. ~1 session |

---

## 3.6 · The DOM, directly — a framing note

React discourages direct DOM manipulation, so teaching LO 3.6 needs a reason that is
not "the syllabus says so." The honest reason: **React is a DOM-manipulation library.**
Doing it by hand once — `querySelector`, `createElement`, `addEventListener`, and the
bookkeeping that gets ugly by the fifth element — is what makes the framework legible
rather than magical.

Build the same small list twice in one session: once by hand, once in React. The point
lands on its own, and no one asks "why do we need React" again.

---

## 3.8 · Testing — the brief version

**Not covered by any syllabus LO**, and kept to about one session. The Final Activity
Project specs require Vitest and Playwright in CI, and §12 makes test-cases-as-issues a
graded workflow — so students need enough to not be lost, not a testing course.

Cover, quickly: what a unit test is · `describe`/`it`/`expect` · testing a pure function
from 3.4 · watching a test fail first, then pass · why a test that has never failed
proves nothing.

Defer to Module 5: component tests, Playwright, and CI. Mention that they exist so the
progression is visible.

**Why here:** this module is the only one that produces plain, testable functions with
no UI or database attached. A pure function is the easiest thing in the course to test,
and testing is easiest to teach on the easiest thing.

---

## Carried forward

- The 8-point design QA still runs on anything with a UI
- Everything written here is TypeScript-adjacent; types arrive as annotations on the
  same JavaScript, not as a new language
