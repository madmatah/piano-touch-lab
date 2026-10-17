# The repository

## What belongs in the repository

- **The repository holds the current state of the project, and nothing else.** It is public. Never commit project-management material, which lives in `.pm/`, a separate private repository:
  - status or tracking files;
  - decision records;
  - roadmaps;
  - handoffs;
  - meeting or research notes, reviews of a branch, wording reviews, lists of deviations from a mockup;
  - the task markers `TODO`, `FIXME`, `XXX` and `HACK`, in a comment or a document.
- **No secret, credential, `.env` file or personal data,** such as a path into a home directory. The deploy reads its Netlify token from the secrets of the repository, never from a file.
- **No file committed by accident:** build output (`dist/`), logs, captures of the interface, probes written to check a change.
- **A change updates every document that describes what it changes, in the same change:** the rules file of a rule, `docs/foundations.md` for the design and its reasons, the skill of a procedure, `README.md` for setup, usage and scripts, `CREDITS.md` for reused work, and `CLAUDE.md` for how a session works.

## External work

- **Credit every external work the project reuses in `CREDITS.md`, in the same change that brings it in.** This covers code or algorithms ported or adapted from another project, data taken from someone else's work (such as David C. Stanwood's standard curves), assets such as fonts or images, components copied from a library such as shadcn/ui, and libraries shipped in the build.
- **Each entry says** what is reused, where it lives in the repository, where it comes from and under which terms. When a license asks for its notice to be kept, copy the notice verbatim.
- **The works the design comes from are named,** with their links, in `docs/foundations.md` > References.
