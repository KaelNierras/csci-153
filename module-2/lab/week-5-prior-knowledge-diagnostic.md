# Week 5 — Prior-knowledge diagnostic

**CSci 153 · Web Systems and Technologies**
Module 2 · Week 5 laboratory · **45 minutes, individual, in the room**
**Not an assessment task.** It carries no marks and cannot lower your grade.

Evidences: **LO 3.2** block scoping · **LO 3.3** loop structures ·
**LO 3.4** functions and arrow expressions · **LO 3.6** DOM manipulation ·
**LO 3.7** JavaScript libraries

---

## Why this exists, said plainly

This course does not lecture JavaScript, React, or npm. Your previous subject did, and
repeating it would spend a third of Module 2 on the thing that is not blocking you.

That is a reasonable decision **only if it is true.** This session is how we find out,
rather than assuming it and discovering the gap in week 12 when a group cannot read their
own code. It is also the record that CO3 was met — the syllabus still requires these five
outcomes, and "they had it before" is an assertion until there is something on file.

**So: answer honestly.** A wrong answer here costs you nothing and buys you a week to fix
it. A guessed answer costs you week 12.

---

## How it runs

| | |
|---|---|
| **When** | Week 5 laboratory, first 45 minutes |
| **How** | Individually, on paper or in a single file. Closed book, open head |
| **Marks** | None. This is a diagnostic, not a quiz |
| **After** | You get your own script back the same day with a band and a reading list |

Six questions. Write the answer *and* one sentence of reasoning — the reasoning is what
tells us whether you know it or recognised it.

---

## The questions

All six use real code from the **Enroll** reference app, so nothing here is abstract.

### 1 · Scope and reassignment  <sub>LO 3.2</sub>

```js
const UNIT_CEILING = 21

function check(subjects) {
  let total = 0
  for (const subject of subjects) {
    const units = subject.units
    total = total + units
  }
  return total <= UNIT_CEILING
}
```

**a.** Which of `UNIT_CEILING`, `total`, `units`, `subject` could be changed to `let`
without breaking anything, and which could not? Why?
**b.** Move `const units` to *above* the loop, unchanged. What happens, and why?

---

### 2 · Three ways to say the same thing  <sub>LO 3.3</sub>

This is the real `totalUnits` from `src/lib/rules/units.ts`:

```js
export function totalUnits(subjects) {
  return subjects.reduce((sum, subject) => sum + subject.units, 0)
}
```

**a.** Rewrite it as a `for…of` loop. Same result, no `reduce`.
**b.** What is the `0` at the end for? What breaks if you remove it and the array is empty?
**c.** Write a one-line expression that returns only the subjects with seats left, given a
`seatsLeft(subject)` function.

---

### 3 · Functions, and what they remember  <sub>LO 3.4</sub>

```js
function makeCounter() {
  let count = 0
  return () => {
    count = count + 1
    return count
  }
}

const next = makeCounter()
next()
next()
console.log(next())
```

**a.** What prints, and why is `count` still alive after `makeCounter` has returned?
**b.** Rewrite `makeCounter`'s inner function as a `function` expression instead of an
arrow. Does anything change?
**c.** Given `export function totalUnits(…)`, write the `import` that brings it into another
file. Then write it again as if it had been a `default` export.

---

### 4 · What React is doing for you  <sub>LO 3.6</sub>

```js
const list = document.querySelector('#subjects')
subjects.forEach((subject) => {
  const row = document.createElement('li')
  row.textContent = subject.code
  list.appendChild(row)
})
```

**a.** This runs a second time when the data refreshes. What is wrong with the screen, and
what line would you add to fix it?
**b.** Write the equivalent in React — the JSX that renders the same list.
**c.** React asks you for a `key` on that list. The DOM version above has no such concept.
What is the `key` *for*?

---

### 5 · Dependencies  <sub>LO 3.7</sub>

From the reference app's `package.json`:

```json
"dependencies":    { "react": "^19.2.8", "zod": "^4.6.5" },
"devDependencies": { "vite": "^8.2.0", "typescript": "~5.9" }
```

**a.** What is the practical difference between the two lists? Which one ships to the
browser?
**b.** `^19.2.8` and `~5.9` allow different upgrades. What can each one move to?
**c.** You need a date-formatting function. Give one reason to install a library and one
reason to write the six lines yourself.

---

### 6 · Read this and say what it does  <sub>synthesis</sub>

```js
export function seatsLeft(subject) {
  return Math.max(0, subject.capacity - subject.enrolledCount)
}
```

In two sentences: what does it return, and why is `Math.max(0, …)` there rather than a
plain subtraction?

---

## Bands, and what each one means

There is no pass mark. There is a reading list.

| Band | Looks like | What to do **this week** |
|---|---|---|
| **Fluent** | 5–6 confident, reasoning is right | Nothing. You are where the course assumes you are |
| **Rusty** | 3–4, right instincts, shaky detail | Re-read the two topics you missed. MDN, an hour. You will be fine |
| **Gap** | 0–2, or the reasoning is guesswork | **Come and say so.** A structured catch-up in week 5–6 is cheap; discovering it in sprint 2 is not |

**"Gap" is not a judgement and it is not recorded against you.** It is the single most
useful thing this session can produce, and the only bad outcome is hiding it.

---

## What the instructor keeps

Retained as the CO3 attainment record, per module, for the OBE file:

- Every script, marked by band, with the LO each question evidences
- A one-page cohort summary: how many in each band, per learning outcome
- The remediation offered, and who took it

That summary is what turns *"this was covered in the previous subject"* from a claim into
evidence. Without it, five of CO3's seven outcomes have nothing behind them —
see `../outline.md`, *What this module does not teach*.

---

## Where the material lives, if you need it

The lessons that used to teach this are retired, not deleted. They are the best revision
source because they use the same codebase:

| Topic | Retired demo, in the reference app |
|---|---|
| Iteration | `map` in JSX is a loop — `SubjectCatalog.tsx` |
| The DOM by hand | `demos/subject-list-vanilla.html`, and its React twin |
| Dependencies | The annotated `package.json` walkthrough |

All three are listed under **Retired — the stack tour** in the reference app's `DEMOS.md`.
