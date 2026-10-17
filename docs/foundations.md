# Piano Touch Lab — Foundations

This document explains the design of Piano Touch Lab and the reasons behind it: the stack, the architecture, the repository layout and the testing approach. The rules that follow from it live in `.claude/rules/`, indexed in `CLAUDE.md`, and the procedures in `.claude/skills/`.

## The project

Piano Touch Lab is a toolkit for piano action balancing, built on David C. Stanwood's touch weight metrology. A technician measures a keyboard key by key (down and up weights, front weight, strike weight, key weight ratio, wippen, support springs), reads the analysis of the action in figures (balance weight, friction, strike weight ratio, front and strike weights against Stanwood's standard curves), designs the balance they want, and prints the adjustment sheets that take them from one to the other. It computes and shows; it makes no design decision for the technician.

These constraints drive the choices in this document:

| Constraint                          | Consequence                                                                                                                                                                                                                                                                                                               |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No backend and no account           | Everything runs in the browser and persists in `localStorage`. A backup file exports the work and imports it into another browser, so its shape is versioned and checked on import.                                                                                                                                       |
| Nothing leaves the browser          | The fonts are self-hosted rather than fetched from a CDN, which would hand the visitor's address to a third party. The demo's analytics script is the one outside request, and only the demo has it.                                                                                                                      |
| A public demo, deployed from `main` | A demo build (`APP_ENV=demo`) adds the Netlify redirects and the analytics script. Every build loads a measured piano on a first visit, so a visitor sees the figures before measuring anything.                                                                                                                          |
| The work ends on paper              | Every figure is laid out for the screen and for the sheet the reader chooses when printing, and a check in a real browser measures both.                                                                                                                                                                                  |
| Two languages, English and French   | The English text is the key of the catalogs, a French catalog translates it, and numbers are written the way each language writes them.                                                                                                                                                                                   |
| Keyboards of any size               | A keyboard is built from its first note and its number of keys, and the standard curves, given for 88 keys, are rescaled to its number of keys (hypothesis: rescaling, rather than aligning the curves note by note, is what Stanwood intends for a keyboard that does not span A0 to C8; to check against his writings). |

## Design lineage

### David C. Stanwood's touch weight metrology

The domain model follows Stanwood's New Touch Weight Metrology and his Equation of Balance: the balance weight and the friction weight derived from the down and up weights, the wippen's weight at the key from the key weight ratio, the strike weight ratio derived from the front weight, the balance weight, the wippen and the strike weight, and the reverse computations that design a front weight or a strike weight for a target balance. His standard curves give the reference front weights and strike weights, level by level, and his vocabulary names the quantities in the code, the interface and the tests.

### Mario Igrec, Pianos Inside Out

The reference for piano technology at large, touch weight analysis included, against which the vocabulary and the procedures are checked.

## Technology stack

| Tool                       | Version    | Role                                                                                      |
| -------------------------- | ---------- | ----------------------------------------------------------------------------------------- |
| Bun                        | 1.4.2      | Runtime, package manager, dev server (`Bun.serve`), bundler (`Bun.build`) and test runner |
| TypeScript                 | 5.9        | Language, strict, with decorators for the service container                               |
| React                      | 19.1       | Interface                                                                                 |
| React Compiler             | 1.0        | Memoizes the components and hooks, through Babel 7 in a Bun plugin                        |
| React Router               | 7.8        | Pages and addresses                                                                       |
| Tailwind CSS               | 4.1        | Styles, through `bun-plugin-tailwind`                                                     |
| shadcn/ui, Radix UI        | —          | Accessible components, generated into `src/components/ui/`                                |
| Apache ECharts             | 6.0        | Charts, drawn in SVG through `echarts-for-react`                                          |
| zustand                    | 5.0        | Stores, persisted to `localStorage`                                                       |
| InversifyJS                | 7.7        | Service container, read by hooks through `inversify-react`                                |
| Zod                        | 4.1        | Schemas of the backup file                                                                |
| i18next, react-i18next     | 25.5, 16.0 | Translations; `i18next-parser` writes the catalogs and `@lingual/i18n-check` checks them  |
| ESLint, typescript-eslint  | 9.33, 8.39 | Linting, with the type-checked rules                                                      |
| Prettier                   | 3.6        | Formatting                                                                                |
| happy-dom, Testing Library | 20.0, 16.3 | The DOM and the rendering of the unit tests                                               |
| tslog                      | 4.10       | Logging, injected as a service                                                            |

Notes:

- **CI runs on GitHub Actions:**
  - `.github/workflows/ci.yml` runs `bun checks` on every pull request and every push to `main`;
  - `.github/workflows/deploy-demo.yml` builds the demo and deploys it to Netlify: a preview for a pull request to `main`, the live site for a push to `main`;
  - actions are pinned to full commit SHAs, the CI may only read the repository, and the deploy may only add a commit status besides.
- **No Node, Vite or Webpack.** Bun runs the TypeScript as it is, serves the page with hot reloading and bundles it, so one tool replaces four.
- **The React Compiler runs through Babel** because Bun's transpiler does not know it: a Bun plugin hands it the components and hooks of `src/`, and leaves the domain to Bun, since it holds no React code and its classes carry decorators. It memoizes what each render computes, where the code would otherwise memoize by hand.
- **Decorators and `reflect-metadata`** are there for InversifyJS, and `reflect-metadata` is imported once, in `src/frontend.tsx`.
- **The fonts are copied, not bundled.** Bun inlines a stylesheet's `url()` as a data URI, which would put about 400 kB of fonts in the stylesheet that blocks rendering, and defeat the splitting by Unicode range. The build copies the files and their licenses to `dist/fonts/`, and the dev server serves them from `node_modules`.
- **`CLAUDE.md` and `.claude/` are the agent guidance** ([Agent guidance](#agent-guidance)).

## Architecture

### Principles

The project follows Clean Architecture: the rules live in a pure domain at the center, and each technology stays at the edge. `.claude/rules/architecture.md` states the rules, and tooling enforces them wherever it can ([Enforcement](#enforcement)).

- **The domain is pure,** so its tests need no DOM, no React and no browser, and the metrology can be read and checked on its own.
- **React is the platform of the application and the adapters.** The application's orchestration is made of hooks, which read the stores and call the domain, so that each page computes from the same pipeline.
- **The keyboard is computed once per page.** A provider measures, analyzes and designs it, and every component reads the result, because the same keyboard feeds the layout, the step bar, the page and the printed summary.
- **Services are bound in one container,** `src/app-container.ts`, with a `Symbol` per port. Hooks resolve them by `Symbol`, and the curve smoothers by name, so a smoothing strategy is chosen as data.
- **What is stored or exported is plain data, and only raw inputs,** so it saves, travels in a backup file and replays as it is, and a derived value can never disagree with its source.
- **SOLID applies to modules, functions and types,** so a new design mode or a new smoother is added beside the others, without rewriting them.

### Layers and modules

| Layer            | Module                                                                                    | Responsibility                                                                                                                                             | Depends on                                                                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Composition root | `src/index.tsx`                                                                           | The server of the page, and of the fonts in development                                                                                                    | `config/fonts.ts`                                                                                                                              |
| Composition root | `build.ts`, `config/`                                                                     | The build into `dist/` and the plugins of the dev server: the React Compiler, the fonts and their licenses, the demo's files                               | Bun, Babel, Tailwind CSS                                                                                                                       |
| Composition root | `scripts/`                                                                                | The figure check                                                                                                                                           | The chart geometry of `src/components/charts/`                                                                                                 |
| Composition root | `src/frontend.tsx`, `src/App.tsx`                                                         | Mount React, the theme, the service container, the keyboard providers and the router                                                                       | Every layer                                                                                                                                    |
| Composition root | `src/app-container.ts`, `src/container-modules/`                                          | Bind each service to its port                                                                                                                              | `src/lib/`, InversifyJS, tslog                                                                                                                 |
| Composition root | `src/components/AppRouter.tsx`                                                            | The routes: home, measure, analyze, design, piano, help                                                                                                    | `src/components/pages/`                                                                                                                        |
| Adapters         | `src/components/pages/`, `src/components/MainLayout.tsx`                                  | One component per route, in the frame of `MainLayout`                                                                                                      | Components, application                                                                                                                        |
| Adapters         | `src/components/measures/`, `analyze/`, `design/`, `home/`, `piano/`, `print/`            | The measuring table, the analysis, the design steps and the adjustment sheet, the home page, the keyboard drawing, the printed header and margins          | Application, domain                                                                                                                            |
| Adapters         | `src/components/charts/`                                                                  | Every figure over the keys, on ECharts                                                                                                                     | Application, domain                                                                                                                            |
| Adapters         | `src/components/layout/`, `navigation/`, `glossary/`, `new-profile/`, `theme/`, `app-ui/` | The page frame, the sidebar, the glossary, the new piano dialog, the themes, shared controls                                                               | Application, domain                                                                                                                            |
| Adapters         | `src/components/ui/`, `src/lib/utils.ts`                                                  | The shadcn/ui components, and their helper for class names                                                                                                 | Radix UI, `clsx`, `tailwind-merge`                                                                                                             |
| Adapters         | `src/assets/`                                                                             | The drawings the icon library lacks, such as the coil spring                                                                                               | React                                                                                                                                          |
| Adapters         | `src/locales/`                                                                            | The English and French catalogs                                                                                                                            | —                                                                                                                                              |
| Adapters         | `src/lib/i18n.ts`, `src/lib/document-language.ts`, `src/lib/print/print-session.ts`       | The setup of i18next, the page's language, the browser's print events; they live in `src/lib/` and move to the adapters (planned)                          | i18next, the browser                                                                                                                           |
| Application      | `src/hooks/`, its own files                                                               | The hooks every layer above shares: translation, the logger and named services, the print page size, element sizes, numeric fields                         | The service container, i18next                                                                                                                 |
| Application      | `src/contexts/`                                                                           | The keyboard, its analysis computed once per page, the new piano dialog                                                                                    | `src/hooks/keyboard/`, `src/components/design/hooks/`, domain                                                                                  |
| Application      | `src/hooks/keyboard/`                                                                     | The pipeline: measured keyboard, analyzed keyboard, designed keyboard                                                                                      | Stores, `src/contexts/`, domain; `src/contexts/` and the stores depend on it in turn, two cycles to break (planned)                            |
| Application      | `src/hooks/store/`                                                                        | The five persisted stores                                                                                                                                  | `src/hooks/keyboard/`, `src/lib/`                                                                                                              |
| Application      | `src/hooks/backup/`, `demo/`, `profile/`                                                  | Export and import of the backup file, the demo piano, a new piano profile                                                                                  | Stores, domain, `src/demo-data/`                                                                                                               |
| Application      | `src/hooks/series/`, `standard-curves/`                                                   | Series interpolated over the keys, and the standard curves rescaled to the keyboard                                                                        | The service container, domain                                                                                                                  |
| Application      | Every `hooks/` folder under `src/components/`                                             | The target series of each design mode, the steps, the adjustment sheet, the readings of the analysis, the series of the charts, the state of the home page | Stores, domain, and the series type, `TouchDesignSerieVariant` and `useGenerateSerie` of `src/components/charts/`, which move inward (planned) |
| Domain           | `src/lib/piano/keyboard/`                                                                 | The keyboard: keys, layouts, placement of the keys on an axis                                                                                              | Domain                                                                                                                                         |
| Domain           | `src/lib/piano/touch-design/`                                                             | The metrology: analyzer, front and strike weight calculators, previewer, design modes, standard curves, bench adjustment                                   | Domain                                                                                                                                         |
| Domain           | `src/lib/geometry/`                                                                       | The curve smoothers and polygons                                                                                                                           | `commons-math-interpolation`, `typescript-cubic-spline`, the decorators of InversifyJS                                                         |
| Domain           | `src/lib/music/`                                                                          | Scientific pitch notation                                                                                                                                  | Domain                                                                                                                                         |
| Domain           | `src/lib/format/`                                                                         | The writing of numbers and units in each language                                                                                                          | Domain                                                                                                                                         |
| Domain           | `src/lib/backup/`                                                                         | The schemas of the backup file, and the file it exports                                                                                                    | Zod; the stores' state types, the clock and the browser's `Blob`, which move out of the domain (planned)                                       |
| Domain           | `src/lib/print/print-margins.ts`                                                          | The print margins                                                                                                                                          | Domain                                                                                                                                         |
| Domain           | `src/lib/logger/`                                                                         | The logger's port                                                                                                                                          | Domain                                                                                                                                         |
| Domain           | `src/demo-data/`                                                                          | The demo piano, measured on a Gaveau                                                                                                                       | Domain                                                                                                                                         |

Two departures from `.claude/rules/architecture.md` show in no row: `src/components/home/figures/demo-sample.ts` creates the analyzer, the front weight calculator and a curve smoother at module level, outside the service container, and merges the measurements of the demo itself (planned: take them from the container and the application); and `src/contexts/keyboard-context.tsx` imports `KeyboardFactory` from its file rather than from the `index.ts` of `src/lib/piano/keyboard/` (planned).

## Repository layout

### Repository tree

```
piano-touch-lab/
├── .claude/                     # Claude Code: settings, rules, skills and the expert reviewers
├── .github/
│   ├── dependabot.yml           # Weekly upgrades of the dependencies
│   ├── pull_request_template.md # The body of every pull request, with its checklist
│   └── workflows/               # CI: the gate, and the deploy of the demo
├── .vscode/                     # Formatting on save
├── config/
│   ├── deploy/netlify/          # The demo's redirects
│   ├── test/                    # What the tests preload: happy-dom, Testing Library, i18next
│   ├── external-fonts-plugin.ts # Keeps the fonts out of the bundle
│   ├── fonts.ts                 # The font files and licenses the site serves
│   ├── i18next-parser.config.cjs
│   └── react-compiler-plugin.ts # Runs the React Compiler before Bun
├── docs/
│   └── foundations.md           # This document
├── scripts/
│   └── check-figures.ts         # The figure check, in a real browser
├── src/
│   ├── index.html, index.tsx    # The page and its server
│   ├── frontend.tsx, App.tsx    # The React entry point and its providers
│   ├── app-container.ts         # The service container
│   ├── components/              # Pages, features, charts, shadcn/ui
│   ├── contexts/                # The keyboard and its analysis
│   ├── container-modules/       # The curve smoothers' bindings
│   ├── demo-data/               # The demo piano
│   ├── hooks/                   # The application: stores, pipeline, backup
│   ├── lib/                     # The domain
│   └── locales/                 # The English and French catalogs
├── styles/                      # The stylesheets and the font faces
├── build.ts                     # The production build
├── CLAUDE.md                    # The session manual for AI agents
├── CREDITS.md                   # External work reused, with its terms
├── LICENSE                      # The Unlicense
└── README.md
```

### Module anatomy

The project is a single unit: a module is a directory of a layer. A feature folder of the adapters looks like this:

```
src/components/design/front-weight/
├── FrontWeightDesign.tsx        # The component of the feature
├── FrontWeightDesign.types.ts   # Its props
└── hooks/                       # Its application hooks
    ├── use-front-weight-target-serie.ts
    └── use-front-weight-recommendation.ts
```

A service of the domain comes with its port beside it:

```
src/lib/piano/touch-design/front-weight-calculator/
├── front-weight-calculator.ts               # The implementation
├── front-weight-calculator.requirements.ts  # The port and its Symbol
└── front-weight-calculator.test.ts
```

### Enforcement

Each row names a rule, the rules file that states it, and what enforces it.

| Rule                                                                                                                    | Enforced by                                                               |
| ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| No `console` (`.claude/rules/conventions.md` > TypeScript)                                                              | ESLint `no-console`                                                       |
| The keys of an object literal are sorted (`.claude/rules/conventions.md` > TypeScript)                                  | ESLint `sort-keys-fix`                                                    |
| No `any`, strict types, `noUncheckedIndexedAccess`, type-only imports (`.claude/rules/conventions.md` > TypeScript)     | TypeScript and the type-checked rules of typescript-eslint                |
| The Rules of React that a linter can see                                                                                | `eslint-plugin-react-hooks`                                               |
| Every key translated (`.claude/rules/translations.md` > Catalogs)                                                       | `bun i18n:check`                                                          |
| Formatting                                                                                                              | Prettier                                                                  |
| Every rule no tool can check: the layers, the comments, the tests as specification, the units, the equations of balance | `/expert-review` ([Code review](#code-review)), before every pull request |

`build.ts` and `config/` are outside ESLint and the type checker, and `config/` outside Prettier too (planned: bring them in).

## Conventions

### Code conventions

The conventions serve one aim: the code explains itself, so that it needs no comments, and a reviewer can check it against the metrology. `.claude/rules/conventions.md` states them.

- **Names carry the meaning,** in Stanwood's vocabulary, which the technician reads in the interface too.
- **A weight's unit is the trade's.** Every weight of the metrology is in grams, so a name ending in `Weight` says its unit, and the stored data keeps the names the backup files already carry.
- **Comments only say why.** The names say what the code does, and the tests state the business rules ([Tests document the rules](#tests-document-the-rules)).
- **Unions of literals rather than enums,** because a design mode or a level is a value that the stores and the backup file save as it is. The levels and the design modes are still enums, and become unions (planned).

### Git

`CLAUDE.md` > Workflow says how a session works, and the `pull-request` skill holds the procedure. The reasons behind them:

- **A worktree per piece of work** keeps parallel sessions from changing each other's files, and keeps the main checkout on `main`, where the user's running dev server never sees work in progress.
- **A stacked branch** costs only a rebase of its own commits when its base is rewritten, so no work waits for a merge.
- **A history rewritten before it is pushed,** into atomic commits whose messages say why, keeps the reasons that a diff cannot show. Each commit passing the gate keeps `main` a safe start for any work.
- **Gitmoji subjects** keep the history alike from its first commit, and name the kind of a change at a glance.
- **"Rebase and merge"** lands each commit as written, after the review ([Code review](#code-review)) and CI ([Technology stack](#technology-stack)).
- **One writer for `.pm/`,** the coordinating session, keeps its commits from racing.

### Agent guidance

Agents work from four kinds of documents, each with one job, so that a statement has one home and never drifts from a copy. `.claude/rules/documents.md` > Where a statement lives says what goes where. The reasons:

- **`CLAUDE.md` is the session manual** because Claude Code loads it whole into every session: each line costs every session, so it holds only what every session needs.
- **The rules live in `.claude/rules/`** because a file with `paths` loads only with the files it governs, and a rule stated there in full, with its reason, needs no second document. A load by `paths` can be missed, by a subagent in its own worktree or after a compaction, which is why each file has its line in `CLAUDE.md`.
- **The rules files follow concerns, not directories,** because a concern often spans several directories, where a `CLAUDE.md` per directory would scatter its rules.
- **Skills hold procedures** because a procedure matters only while its task runs, and a skill loads only then.
- **This document holds the design and its reasons,** and states no rule, so that a rule changes in one place.
- **An expert reviewer reads at least the rules files of its domain,** one hop away, so that it never chases a rule across documents.
- **The history of a decision lives in `.pm/`**, a private repository nested in the main checkout, so the documents here describe only the present, with its reasons.

## Testing

### Tests document the rules

The tests are the specification of the business rules. To learn how a part of the system behaves, read its tests: each scenario and its outcome state one rule, in the vocabulary of the metrology. That is why the code carries no comment that states a rule. `.claude/rules/tests.md` says how tests are written.

### Test levels

- **The unit tests** run in a fraction of a second on happy-dom, so the gate runs all of them on every commit. They check the metrology, the hooks and the components, but not what the browser lays out.
- **The figure check** opens a real browser, because a chart drawn by ECharts and the keyboard drawn beside it agree only as long as they are given the same width, which nothing in the types or the unit tests can say, and because printing is the one moment the page is laid out against something other than the window. It needs a running server and takes minutes, so it stays outside the gate.

### Budgets

No budget is set yet. The first one comes with the benchmark that measures it. The costs of the interactions have been measured by hand: most of an interaction's time goes to the browser drawing the SVG of the charts, not to the JavaScript.

### Code review

Every branch goes through `/expert-review` before its pull request. It is a project skill in `.claude/skills/expert-review/`, named so that it never shadows the built-in `/code-review`.

- **It runs in its own subagent**, which never saw the code being written, so the review stays independent of the session that wrote the code, and that session keeps its context.
- **One expert per domain, in parallel.** Correctness reviews every diff, and conventions every diff that holds code or configuration. Architecture, tests, performance, security, documentation and the touch weight metrology join when the diff touches their domain. Each expert is an agent of `.claude/agents/` on the strongest model, and cannot run a command, so that no reviewed text can make it act.
- **The metrology has an expert of its own** because its errors pass every other check: a sign wrong in the equation of balance, or a spring counted twice, compiles, passes the tests that state the wrong rule, and prints a wrong adjustment sheet.
- **The orchestrator confirms every blocking and should-fix finding** before reporting it, and lists the findings it dropped with their counter-evidence, so the report makes no claim it has not checked.
- **A target other than the current branch is checked out outside the repository**, so a reviewed `CLAUDE.md` never loads as an instruction.
- **Reviews can run at the same time, from the same checkout:** each one keeps its scope in a temporary directory of its own.
- **The report ends the review.** It suggests a fix for each finding but applies none: the session that wrote the code fixes or answers each one, and the user decides at the merge.

## References

- David C. Stanwood, [Piano Technicians Resource Page](https://www.stanwoodpiano.com/touchweight.htm): the New Touch Weight Metrology, the Equation of Balance and the standard curves.
- Mario Igrec, [Pianos Inside Out: A Comprehensive Guide to Piano Tuning, Repair, and Rebuilding](https://www.pianosinsideout.com/).
- [Bun](https://bun.sh/docs), [React](https://react.dev), [React Compiler](https://react.dev/learn/react-compiler), [Apache ECharts](https://echarts.apache.org/en/option.html), [zustand](https://zustand.docs.pmnd.rs), [InversifyJS](https://inversify.io), [i18next](https://www.i18next.com), [shadcn/ui](https://ui.shadcn.com), [Tailwind CSS](https://tailwindcss.com/docs).
