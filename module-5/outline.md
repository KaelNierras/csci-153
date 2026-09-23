# Module 5 — QA & Acceptance · outline

**CSci 153 · Week 14 clinic, then weeks 16–17 · Milestone 5**
**No syllabus LO requires this module.** Every one of the three Final Activity Project specs
does — §12 makes test-cases-as-issues a graded workflow, and the Final Web Project is
*demonstrated*, not submitted.

Status: **ready** — 21 slides, `module-5/index.html`. Interactive instruments: the Day In
The Life cycle stepper (5.3) and the 12-point QA checklist (5.4).

> ## The milestone
>
> **Prove it works, then hand it over.** Nothing new is built. The deliverable is evidence:
> a green end-to-end suite built from cases somebody else wrote, a Day In The Life run that
> completes on the deployed app without a blocking defect, every screen past the 12-point
> QA, and a repository that survives being read out loud.
>
> Added 2026-09-22. Before that, e2e testing was a clinic inside Module 4 and the codebase
> assessment was its closing lesson — which meant the course's whole quality story was an
> appendix to the frontend module. It is now the fifth milestone, and it maps exactly onto
> sprint 4.

---

## Lesson order

| # | Lesson | Slides | When |
|---|---|---|---|
| 5.1 | **End-to-end testing** | 3 | **W14** clinic, ~45 min |
| 5.2 | **Test cases as issues** | 4 | **W14** clinic |
| 5.3 | **Day In The Life** | 5 | **W16** |
| 5.4 | **The 12-point QA pass** | 2 | **W16** |
| 5.5 | **Codebase assessment** | 2 | W16–17, the graded read-through |

5.1 and 5.5 moved here from Module 4 (old 4.6 and 4.8). 5.2, 5.3 and 5.4 are new or expanded.

---

## 5.2 · Test cases as issues

The specs' §12 workflow, and the reason it is split the way it is: **whoever writes the case
does not write the test.** The Project Manager files the scenario in words, a contributor
implements the Playwright test in a PR that closes the issue, and CI runs it forever.

Someone writing both tends to write the test they already know passes. Handing the case to a
different person is what surfaces the ambiguity — and an ambiguous test case is a requirement
nobody actually agreed on.

Two slides were added here because the original single slide asserted the workflow without
showing it: a **good case beside a useless one** for the same rule, in Given/When/Then, and
the **five-line defect report** with a triage scale. *Won't fix* is taught as a legitimate
engineering answer; an unanswered issue is not.

---

## 5.3 · Day In The Life — the new material

**Day In The Life (DITL) testing** is one complete operational cycle, walked end to end, in
the order a real day happens — not feature by feature. It is the last check before a system
is accepted.

**The argument for it:** every test in the suite starts from a database you reset and a user
you just created. That is what makes tests repeatable, and it is exactly what makes them
blind. A DITL run is the only thing in the course that exercises *state the previous step
left behind*, two roles acting on one record in sequence, and the second lap through a
workflow — which is where most real bugs live.

### The four conditions

None of them are optional, and the run is worthless without all four:

1. **On the deployed app**, at its real URL with the real database. Not `localhost`, not the
   mock — half of what a DITL run finds is environment, not code.
2. **Driven by someone outside the group.** You may not touch the keyboard and you may not
   explain. Every sentence you want to say out loud is a defect in the interface.
3. **From data with a history**, not a fresh reset — the state every real system is
   permanently in.
4. **Nothing is fixed during the run.** Write it down and keep walking, or a measurement
   becomes a debugging session and you lose the rest of the cycle.

One person scribes. Hesitations count as findings even when nothing is broken.

### What it produces

Every finding becomes a bug issue, a UX issue for the 12-point QA, or a **missing test case**
— which is how the e2e suite grows honestly rather than by whatever somebody thought of.

**The gate:** a DITL run completes across every role, driven by an outsider, with every
finding filed — and **repeated until it completes without a blocking defect.** The first run
always fails; the second one is the one that means something.

This is also the Final Web Project demonstration, rehearsed. A demo *is* a Day In The Life
run with an audience, so a clean run means the demo is already written.

---

## Laboratory

| Activity | Week | |
|---|---|---|
| **A10** E2E tests from issues | 16 | moved here from Module 4 with the lesson it depends on |

The brief is not written yet. It needs: test cases the student did not write, implemented as
Playwright tests that pass, in PRs that close the issues.

---

## Carried forward — everything

```
Milestone 1  UI/UX      design the screen, then build it static
Milestone 2  Contract   agree the shape of the data
Milestone 3  Backend    implement that shape
Milestone 4  Frontend   consume it, validate it, ship it
Milestone 5  QA         prove it works, then hand it over
```

**You cannot accept a system you have never run end to end.** That is the sentence this
module exists for, and it is the one students will meet again on their first job.
