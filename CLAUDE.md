# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

Course material for **CSci 153 — Web Systems and Technologies** (Visayas State University,
Dept. of Computer Science and Technology): five interactive HTML slide decks, their
outlines, the laboratory activity sheets, and the semester plan. It is published to GitHub
Pages. There is no application code here — the reference app it teaches from lives outside
this repo (see *The reference app* below).

The course is **five modules, and each module is one milestone** in the order a group
actually builds a system: UI/UX → Contract → Backend → Frontend → QA. `plan/milestones.md`
is the authoritative document for that structure and the old→new lesson map;
`plan/semester-calendar.md` is the week grid. Change those first when the shape of the
course changes, then propagate to the affected module.

## Commands

```bash
python3 shared/build.py            # build every module + regenerate index.html
python3 shared/build.py module-1   # build one module only (leaves index.html alone)
python3 -m http.server 8000        # preview; decks need to be served, not opened as file://
```

No package manager, tests, or linters — the decks are hand-written ES5 + CSS with no build
step beyond `build.py`. Deep-link any deck with a slide number: `module-3/index.html#23`.

## Generated files — never hand-edit

- `index.html` at the repo root is written by `build.py` from each `module-N/module.json`.
  Edit the card markup inside `build.py` (`card()` / `landing()`), not the output.
- `module-N/module-N.standalone.html` is the offline build with `shared/deck.css` and both
  JS files inlined. It is gitignored and rebuilt by CI.
- `plan/index.html` is the exception: it is hand-written and `build.py` does not touch it.

`.github/workflows/pages.yml` runs `build.py` on every push to `main`, **fails the build if
any `module-N/index.html` has fewer than 5 `class="slide` matches**, then deploys the whole
tree. So the published site can never drift from the sources, but a broken deck can fail CI.

## Deck anatomy

Each `module-N/` holds:

| File | Role |
|---|---|
| `index.html` | the deck itself — a complete HTML document |
| `module-N.js` | module-specific widgets |
| `module.json` | metadata for the landing-page card |
| `outline.md` | the authoritative teaching plan for the module |
| `lab/*.md` | laboratory activity sheets (only modules 1 and 2 so far) |

A deck **must** have `<!doctype html>` and a literal `</body>`. Without them live-server
injects its reload script into the first `</svg>` — inside the nav buttons — and serves a
blank deck; `build.py` warns about both. Templates for widgets live in the comments above
each widget's code in `shared/deck.js`.

### Slide markup contract

```html
<section class="slide" data-sec="1.1" data-label="Contrast" data-rail="Lesson 1.1">
```

`data-sec` drives the progress tick colour and the section accent (`#deck[data-sec="…"]`
rules in the CSS restyle the whole chrome); `data-label` names the slide in the map (`O`);
`data-rail` overrides the top-rail lesson name. Section names and colours are declared
per-deck in a `<script type="application/json" id="deck-sections">` block in the `<head>`,
falling back to the `0` / `lab` / `end` defaults in `deck.js`.

`shared/deck.js` owns navigation, the slide map, keyboard control (`→`/`←`, `O` map,
`?` help, `F` fullscreen), touch swipe, and the generic widgets: `data-widget="ba"`
(before/after), `"stepper"`, `"quiz"`, `"check"`, and any `[data-copy]` button. It emits a
`slidechange` CustomEvent that module widgets can listen for.

`module-N.js` widgets are **self-contained IIFEs that bail out quietly when their mount
point is missing** — that is what lets slides be reordered, deleted, or carried between
decks without breaking the rest of the file. Keep new widgets in that shape and in the same
ES5 idiom (`var`, no modules, no dependencies).

`shared/deck.css` is the design system for every deck *and* for `index.html` and
`plan/index.html`: tokens on `:root` (dark-only, ink ground with brass = human craft,
cyan = agentic, violet = required by the Final Activity Project but by no syllabus
outcome), a 4pt spacing scale (`--s1`…`--s8`), and the `.panel` / `.grid` / `.compare` /
`.steps` / `.chip` primitives the slides are built from. Prefer an existing class over new
CSS, and define any new colour as a token rather than a literal.

### `module.json`

`number`, `title`, `subtitle`, `weeks`, `milestone`, `delivery`, `outcome`, `slides`,
`status` (`ready` renders an open card, anything else renders "In preparation"), and
`labs` as `[["display name", "lab/file.md"], …]`. **`slides` is hand-maintained** — update
it when you add or remove slides, or the landing page will lie. `deck_title`, `standalone`
and `kb` are filled in by the build.

## Conventions

- **Conventional Commits with a scope**, e.g. `feat(module-3): …`, `fix(module-2): …`,
  `docs(reference-app): …`, `refactor(decks)!: …` for a breaking re-cut. This is also
  taught in the decks and graded in the rubrics, so the history is itself an example.
- Outlines and plan documents date their decisions in-line (`**Decided 2026-09-22.**`) and
  keep the superseded reasoning rather than deleting it. Follow that when revising them.
- The syllabus `.docx`/`.pdf` and `Final Activity Project/` are gitignored — instructor
  source material, not course-delivery material.

## The reference app

`reference-app/` contains only documentation of **Enroll**, the instructor-built worked
example that the decks open on the projector. The code lives at
`~/Documents/Visayas State University Files/csci-153-enroll`. `PROJECT-CONTEXT.md` here is a
**mirror — the copy in the app repo is the one to edit.** Its two governing rules: nothing
exists in that app unless a specific lesson points at it, and its git history is a teaching
artifact (one commit per idea). Ceiling: 11 API operations, 6 screens, 2 roles. When the app
changes, the module outlines and the decks that cite its numbers have to follow.
