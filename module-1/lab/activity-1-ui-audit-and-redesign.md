# Laboratory Activity 1 — UI Audit and Redesign

**CSci 153 · Web Systems and Technologies**
Module 1 · Lesson 1.1 · Week 2 · Assessment task **CA 1**
Course outcome **CO1** · Learning outcome **LO 1.1**

> ### This one is individual
>
> Submit your own critique, your own tokens, your own rebuild. The Final Activity
> Project later in the semester is group work, and Activity 2 is partly shared — but
> not this one, and the reason is deliberate.
>
> Everything that comes after this course's first two weeks assumes *you personally*
> can look at a generated screen and see what is wrong with it. You will run the
> 8-point QA on agent output every week until December, and you will defend a screen
> out loud at the Practical Exam with no one to hand the question to. If someone else
> writes the findings for you now, that gap does not show up until it is expensive.
>
> Discussing the screenshot with classmates is fine and encouraged. Submitting
> someone else's findings, tokens, or markup is not.

---

## Scenario

You are handed a screenshot of a working but poorly designed academic web page — an
enrollment form, a grade viewer, or a document request portal. It functions. It is
unpleasant to use.

Your job is to say *precisely* why, then prove your diagnosis by rebuilding it.

> The screenshot will be posted on VSUEE at the start of the week 2 laboratory
> session. If you would rather audit a real page you use at VSU, message me before
> the session and I will approve it.

---

## What you submit

### 1 · Written critique — 8 to 12 findings (`critique.md`)

One finding per item, each with exactly three parts:

| Part | Requirement |
|---|---|
| **Principle** | Name the specific principle or Nielsen heuristic violated |
| **Evidence** | Quote or describe the exact element, with a measurement where one applies |
| **Fix** | The concrete change, stated so a developer could action it without asking a follow-up |

**A finding that earns full marks**

> **Contrast (WCAG AA).** The subject description text is `#9AA3B0` on `#FFFFFF` —
> a ratio of 2.71:1, below the 4.5:1 minimum for body text. Darken it to `#5A6472`
> (7.1:1) rather than enlarging the text, since the column is already narrow.

**A finding that earns zero**

> The colors look washed out and it feels kind of old.

At least **three** findings must cite a Nielsen heuristic by name, and at least
**two** must include a measured value (contrast ratio, pixel size, tap target).

### 2 · Token set (`tokens.css`)

CSS custom properties, three layers, with a comment naming each layer:

- **Neutral ramp** — 5 to 7 steps, from ground to primary text
- **One accent** — and a stated reason for the hue
- **Three semantics** — success, warning, danger, all distinct from the accent
- **Type scale** — base size and ratio both stated in a comment, 5 steps
- **Spacing scale** — 4pt or 8pt base, stated

### 3 · Redesigned screen (`index.html`)

A single self-contained HTML file. Rebuild the audited screen so that every finding
in your critique is addressed.

**Constraints**

- Tokens only. No hard-coded hex values, no off-scale spacing, no invented font sizes.
- No component library, no icon library, no external images or fonts.
- All **seven states** for the primary interactive component: default, hover, focus,
  active, disabled, loading, and empty/error.
- Holds together at **320px** wide with no horizontal scrolling on the body.
- Passes all **8 design QA checks** from the deck.

### 4 · Prompt log (`prompt-log.md`)

- The design brief you gave the agent
- The plan it proposed, and what you corrected before letting it generate
- At least **one error it made that you caught**, with the correction you sent
- What you rejected and why

A log that reads as though it were written after the code is worth zero, and is
referred to the integrity policy.

---

## Submission

- **Where** — VSU E-Learning Portal, Module 1 folder
- **When** — before the start of the week 3 session
- **What** — `SURNAME_A1.zip` containing:

```
SURNAME_A1/
  critique.md
  tokens.css
  index.html
  prompt-log.md
```

---

## Rubric — 100 points

| Criterion | Pts | Full marks looks like |
|---|---|---|
| **Diagnostic precision** | 25 | Every finding names the principle or heuristic, cites evidence, and proposes an actionable fix. No vague aesthetic complaints. |
| **Token discipline** | 20 | Three-layer tokens, no hard-coded values anywhere in the markup, type and spacing on a stated scale. |
| **State completeness** | 20 | All seven states present and visibly distinct; empty and error states designed rather than defaulted. |
| **Accessibility floor** | 15 | Measured contrast passing AA, visible focus on every control, labels present, keyboard-operable, works at 320px. |
| **Loop documentation** | 15 | Prompt log shows a real plan → review → iterate cycle with at least one caught agent error. |
| **Craft** | 5 | Coherent, deliberate, defensible as a whole. Not templated. |

**Automatic deductions**

- Any hard-coded hex in the markup — **−5 each**, maximum −15
- Missing or removed focus states — **−10**
- Placeholder used in place of a label — **−5**
- Prompt log that does not match the submitted code — referred to the integrity policy

---

## Checklist before you upload

- [ ] 8–12 findings, each with principle + evidence + fix
- [ ] ≥ 3 findings cite a Nielsen heuristic by name
- [ ] ≥ 2 findings include a measured value
- [ ] `tokens.css` has all three layers, commented
- [ ] Zero hard-coded values in `index.html`
- [ ] Seven states visible and distinct
- [ ] Tabbed the whole screen with the mouse unplugged
- [ ] Checked at 320px and at 200% zoom
- [ ] Ran all 8 design QA checks
- [ ] Prompt log contains a real correction you made
