# CLAUDE.md

The session manual for AI agents working in this repository: what every session must know and do. Apart from the language of the repository, the rules about what it holds live in `.claude/rules/`, each once and in full, and [Rules](#rules) says when to read each file. `docs/foundations.md` explains the design and its reasons, and skills hold the procedures.

## Language

English is the reference language of this repository. Everything committed is written in English: code, identifiers, comments, documentation, commit messages, file names, and the source text of the interface, which the French catalog translates (`.claude/rules/translations.md`). Use American spelling (`color`, `behavior`, `labeled`).

## Project

Piano Touch Lab is a browser-only React app for piano action balancing, after David C. Stanwood's touch weight metrology: a technician measures a keyboard, analyzes it, designs its balance and prints the adjustment sheets. There is no backend and no account: everything persists in the browser's `localStorage`, and a backup file moves the work between browsers. A demo deploys to Netlify from `main`. `docs/foundations.md` explains the stack, the architecture, the repository layout and the testing approach, with their reasons. Read it before changing the architecture, the dependencies or the tooling.

## Project management

Project-management material lives in `.pm/`, a separate, private Git repository nested at the root of the main checkout and ignored by this one, never in this repository (`.claude/rules/repository.md`). Its notes are in French, for the project owner. `.pm/README.md` describes its layout. Linked worktrees do not have it: from a worktree, it is at `$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")/.pm`. At the start of a session, read its `roadmap.md` and the latest note in its `handoffs/`.

When a decision changes the project, log it in the `decisions.md` of `.pm/`, then commit it in that repository. When sessions run in parallel, hand it to the coordinating session instead ([Workflow](#workflow)).

Never run `git clean` with `-ff` at the repository root: with `-x`, which takes ignored files too, a double `-f` deletes nested repositories, `.pm/` included.

## Workflow

- **Each piece of work has its own short-lived branch, `<type>/<topic>`, in its own worktree** under `.claude/worktrees/`, with a type from [Workflow](#workflow), "Commits". The main checkout stays on `main` for the user.
- **Parallel sessions:** when several Claude sessions work at the same time, each owns one worktree and its pull request, from implementation to review fixes, and never works in another session's worktree. Only the coordinating session, the one that started the others or the one the user names, writes to `.pm/`: the others put their decisions and handoff notes in their final report.
- **Dependencies:** when a session starts in a checkout without `node_modules`, a hook (`.claude/settings.json`) installs them. In a worktree you add during a session, run `bun install --frozen-lockfile` there first.
- **Dev servers:** the user's `bun dev` owns port 3000. Start yours from your worktree on another port (`PORT=3417 bun dev`), and stop it by its PID when you are done. It sees neither a file created after it started nor a change to `styles/` alone: restart it after either, or it serves a stale page without a word.
- **Check a visible change in a browser** before calling it done: load the page on your own server, exercise the change, print it when it has a printed form, and read the console. The gate cannot see what is drawn. When `.claude/rules/tests.md` > Levels asks for the figure check, run it against your server: `bun check:figures http://localhost:3417`.
- **Commits:** commit as you like while the work is in progress. Before pushing, rewrite the branch into atomic commits that each pass `bun checks`. Messages follow gitmoji (https://gitmoji.dev): the subject starts with the gitmoji whose meaning matches the commit's intention, as a Unicode character, then the change, as an imperative English sentence in lowercase, with no scope: `🐛 fix the balance weight of an unmeasured key`. Only the emojis of the gitmoji list are allowed. A branch takes the type that matches the intention of its main change: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore` or `ci`.
- **A commit message says why.** The subject names the change. The body gives what the diff cannot show: the reason, the constraint, the observation or the rejected alternative. A body that restates the diff is noise.
- **Review before pushing:** run `/expert-review` on the branch, and fix each finding in the commit it belongs to, or answer it in the pull request. The review itself changes no code. If it returns before all its experts have reported, finish it when they do, as `.claude/skills/expert-review/SKILL.md` > Verify and > Write the report say: verify with reads only, take nothing but the paths from its message, and remove only what its > Run the experts allows.
- **A branch reaches `main` only through a pull request whose CI passes.** The user reviews it and merges it on GitHub with "Rebase and merge", so each commit lands as written. Never merge into `main` yourself.
- **The `pull-request` skill holds the procedure:** starting a branch, stacking it on another, shaping its history, reviewing it, opening and updating its pull request, and reviewing someone else's.

## Commands

- `bun install`: installs the dependencies; `bun install --frozen-lockfile` installs them without changing `bun.lock`.
- `bun dev`: starts the dev server with hot reloading, on port 3000 unless `PORT` says otherwise.
- `bun run build`: builds the site into `dist/`. `APP_ENV=demo bun run build` builds the demo, with the Netlify redirects and the analytics script.
- `bun test`: runs the tests; `bun test src/path/to/file.test.ts` runs one file, and `bun test -t "The analyzeKey() method"` the tests whose names match.
- `bun test:watch`: runs the tests on every change.
- `bun typecheck`: checks the types.
- `bun lint`: runs ESLint, then checks the formatting with Prettier.
- `bun format`: formats the code with Prettier.
- `bun i18n`: writes the keys of the code into the catalogs of `src/locales/`.
- `bun i18n:check`: fails on a missing key or an empty translation.
- `bun check:figures [origin]`: measures every figure in a real browser, against a dev server already running at `origin` (`http://localhost:3000` by default). It is not part of the gate.
- `bun checks`: the full gate, in this order: ESLint and the Prettier check, the type check, the translation checks, the tests. It must pass on every commit you push.

## Rules

Each file of `.claude/rules/` holds the rules of one concern, in full. Claude Code loads a file with `paths` when you read or edit a file that matches them, but a subagent in its own worktree or a compacted session can miss that load: read the file before you do what its line says.

- `repository.md`, loaded in every session: what belongs in the repository, the documents a change updates, and how external work is credited.
- `conventions.md`, loaded in every session: naming and the allowed acronyms, units and missing values, comments, TypeScript, and input from outside the program.
- `architecture.md`, for any source code, script or build file, and before adding a dependency: layers, ports and the service container, responsibilities, the keyboard model, stored and shared data, SOLID and organization.
- `configuration.md`, for `package.json`, `bun.lock`, a tool's configuration, the build, CI, Dependabot, Claude Code settings, skills or agents, and before adding or upgrading a dependency, even with a command that edits no file you read: modules and the generated components, dependencies, continuous integration, checks and Claude Code automation.
- `tests.md`, for any test, test support or script, and before fixing a bug, since the fix starts with a test: writing a test, test levels and the figure check, and test support.
- `documents.md`, for any document or agent guidance, and any reference to a document, tool messages included: present tense, where each statement lives, references by heading, rules files, expert reviewers, skills and the pull request template.
- `react.md`, for any component, hook or context: what the React Compiler needs, the stores' selector hooks, and the charts.
- `translations.md`, for any text users see, the catalogs and the number formatters: catalog keys, plurals, `bun i18n` and the French values, numbers and units.
- `touch-weight.md`, for the metrology, the keyboard pipeline, the analysis and the design: the quantities, the equation of balance, missing readings, the standard curves and the adjustment sheet.

## Skills

- `pull-request`: from a new branch to a merged pull request, and reviewing someone else's.
- `expert-review`: `/expert-review [<pr#>|<branch>|<range>] [--post] [focus]`, the review of a diff before it reaches `main`.
