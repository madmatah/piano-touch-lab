## Purpose

<!-- Why this pull request exists: the need or the problem, in a few sentences. -->

## Proposal

<!-- The solution in broad strokes: what it is made of, not how each line works. If the branch is stacked on another, name its pull request. -->

## How to test

<!-- Steps for the reviewer: what to run, which page to open, what to try, what to look for, on screen and printed. -->

<details>
<summary>How it was tested</summary>

<!-- What the author ran and observed: the tests added, the pages checked in a browser, the figure check, captures of anything visible. -->

</details>

## Checklist

<!-- Tick an item only once it holds. -->

### Quality

- [ ] `bun checks` passes on every commit.
- [ ] `/expert-review` ran on the completed branch, and every finding is fixed or answered here.
- [ ] A visible change was checked in a browser, printed when it has a printed form, and `bun check:figures` passed when it touches a chart, a figure or a page's layout.

### History

- [ ] Each commit is atomic, its subject is a gitmoji and an imperative English sentence, and its body says why; no `fixup!` commit is left.

### Documentation

- [ ] The documents describe the new state: `docs/foundations.md`, `README.md`, `CLAUDE.md`, `.claude/`.
- [ ] Every new text has its French translation, in the words of the glossary.
- [ ] Every external work brought in, including a library shipped in the build, is credited in `CREDITS.md`.

### Hygiene

- [ ] No secret, credential, `.env` file or personal data is committed.
- [ ] No project-management material is committed: status, roadmap, decisions, handoffs, notes, `TODO`.
- [ ] No file is committed by accident: build output, logs, captures, probes.
