---
paths:
  - '*.md'
  - 'docs/**'
  - '.claude/rules/**'
---

# Documents and agent guidance

## Present tense

- **Documents describe the present.** They keep the reasons behind a choice and drop its history. How a decision came about lives in `.pm/`, whose notes are history by design, are written in French for the project owner, and follow none of these rules.
- **What is not built says so.** A built component is described in the present tense, with no label. A planned one is labeled "(planned)".
- **An unsettled choice is a hypothesis,** written "(hypothesis: …)" with the test or the measurement that will settle it.

## Where a statement lives

Each statement has one home, so that it never drifts from a copy.

- **A rule about what the repository holds,** its code, tests, configuration and documents, lives in `.claude/rules/`, once and in full, in the file of its concern.
- **Session conduct** lives in `CLAUDE.md`: what a session reads first, its workflow, the commands, the language of the repository, and one index line per rules file. Every session loads all of `CLAUDE.md`, so it stays under 200 lines.
- **The design and its reasons** live in `docs/foundations.md`. It may say what a rule protects and why, but it does not restate the rule.
- **A procedure** lives in a skill, under `.claude/skills/`.
- **Setup, usage and scripts for people** live in `README.md`, and the credits in `CREDITS.md`.
- **The text users see** lives in the translation catalogs of `src/locales/`, keyed by its English source in the code.

## References

- **A reference names a file, and one of its headings when it points at a part:** `docs/foundations.md` > Layers and modules. Inside a document, it links the heading instead: `[References](#references)`. When a short section holds several rules, the reference adds the rule's bold name, in quotes: `CLAUDE.md` > Workflow, "A commit message says why".
- **Never a number:** no section, rule or step number of a document of this repository. A number says nothing about its target, and it shifts when something is inserted before it. An outside standard is cited as its authors number it, such as the SIL Open Font License, condition 2.
- **Every cited file and heading exists.** A change that renames or removes a heading updates every reference to it, in the documents, the agent guidance and the messages of the tools.

## Rules files

- **One file per concern.** A concern that spans several directories stays in one file. A `CLAUDE.md` per directory would scatter such a rule, or duplicate it.
- **A rules file is self-contained.** It states each rule in full, with enough of its reason to apply it, and never sends its reader to another document for a rule.
- **`paths` decide when a file loads.** Claude Code loads a file with `paths` when a session reads or edits a matching file, and a file without `paths` in every session and every subagent. Only what every session needs goes in a file without `paths`, kept short.
- **`paths` are kept by hand, per concern.**
- **Each rules file has its line in `CLAUDE.md`,** which names its topics and when to read it, without restating its rules. A subagent in another worktree, or a compacted session, can miss a load by `paths`: the line tells it to read the file.
