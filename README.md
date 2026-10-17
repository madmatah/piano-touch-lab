# Piano Touch Lab, a toolkit for piano action balancing

## Overview

Piano Touch Lab is a web application designed to help measure,
analyze, and design optimal piano action balancing. Based on the
groundbreaking work of David C. Stanwood, particularly his "New Touch
Weight Metrology" and "The Equation of Balance" methodologies, this
tool provides a complete workflow from initial measurements to
generating adjustment sheets.

**Important:** Piano Touch Lab is a toolbox, not a magic wand.
It provides the tools for measurement, analysis, and calculation, but
it makes no design decisions _for you_. All balancing and adjustment
choices must come from a trained technician with proper knowledge of
piano action regulation methods. Your expertise, your hands, and your
judgment are what turn these numbers into a responsive action. This
tool is here to assist your expertise, not replace it.

## Demo

Piano Touch Lab is available as a web application. You can access it
directly in your browser without any installation required at the
following URL :
[https://www.piano-touch-lab.com](https://www.piano-touch-lab.com)

No account required. Everything is stored locally in your browser.

## Key Features

### 📏 **Measurement Tools**

- Measure essential touch weight parameters
- Support for optional wippen support spring measurements
- Custom keyboard layout support for non-standard pianos

### 📊 **Analysis & Visualization**

- Interactive charts for all measured parameters
- Automatic computation of Friction and Balance Weight
- Automatic computation of the Strike Weight Ratio
- Visualization of standard curves for Front Weight and Strike Weight

### 🎯 **Modeling & Calculation**

- Model and calculate balancing scenarios based on standard or custom curves
- Automatic computation Front Weight or Strike Weight
- Support for custom smoothed curves
- Modeling of the wippen support spring tension impact
- Real-time preview of the resulting touch weight

### 🗃️ **Management & Reporting**

- Generate comprehensive and printable **Adjustment Sheets**
- Export your work to a file for backup or archiving
- Import/Export data to manage multiple pianos

## The Story Behind Piano Touch Lab

Piano Touch Lab was born from a personal journey: that of a piano
enthusiast, fascinated as much by the musical instrument as by its
complex mechanics.

I am a software developer by trade, but also an amateur engaged in the
restoration project of a grand piano. While diving into the technical
literature, I discovered the foundational work of David C. Stanwood.
His methodologies on action balancing are brilliant, but also dense
and complex to fully grasp.

To ensure I mastered every concept, every calculation, and every
interaction of the "Equation of Balance," I started doing what I do
best: writing code. I built a small application to model these
principles and validate my own understanding.

What began as a personal learning tool quickly evolved into something
more comprehensive. I realized that if this tool was so helpful to me
for analysis and design, it could be just as useful for other
enthusiasts and professional technicians.

So, I decided to share this project as open source. It's my way of
contributing, on my own small scale, to the wonderful community of
piano lovers, and I sincerely hope you find it useful.

## Learning Resources

To deepen your understanding of piano action balancing and touch
weight analysis, the following resources are recommended:

### David C. Stanwood's Work

[David C. Stanwood](https://www.stanwoodpiano.com/) developed the
methodologies that form the foundation of modern touch weight analysis.
His [Piano Technicians Resource Page](https://www.stanwoodpiano.com/touchweight.htm)
provides invaluable technical documents to learn about touch weight analysis and improvement.

### Comprehensive Reference Book

**"Pianos Inside Out: A Comprehensive Guide to Piano Tuning, Repair, and
Rebuilding"** by Mario Igrec is an essential reference that covers
touchweight analysis along with all aspects of piano technology. Learn
more at [pianosinsideout.com](https://www.pianosinsideout.com/).

## Development

To contribute to Piano Touch Lab or run it locally.

### Requirements

- [Bun](https://bun.sh), the runtime and package manager, in the version
  named by the `packageManager` field of `package.json`.

### Getting started

```bash
git clone https://github.com/madmatah/piano-touch-lab.git
cd piano-touch-lab
bun install
bun dev
```

The app is then served at http://localhost:3000.

### Commands

| Command                      | Effect                                                                                                                           |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `bun dev`                    | Starts the dev server with hot reloading, on port 3000 unless `PORT` says otherwise.                                             |
| `bun run build`              | Builds the site into `dist/`. `APP_ENV=demo bun run build` builds the demo, with the Netlify redirects and the analytics script. |
| `bun test`                   | Runs the tests. `bun test:watch` runs them on every change.                                                                      |
| `bun typecheck`              | Checks the types.                                                                                                                |
| `bun lint`                   | Runs ESLint, then checks the formatting with Prettier.                                                                           |
| `bun format`                 | Formats the code with Prettier.                                                                                                  |
| `bun i18n`                   | Writes the keys of the code into the English and French catalogs of `src/locales/`.                                              |
| `bun i18n:check`             | Fails on a missing key or an empty translation.                                                                                  |
| `bun check:figures [origin]` | Measures every figure in a real browser, against a dev server already running at `origin` (`http://localhost:3000` by default).  |
| `bun checks`                 | Runs every check: ESLint and Prettier, the types, the translations, the tests. Must pass on every commit that reaches GitHub.    |

### Documentation

[`docs/foundations.md`](docs/foundations.md) explains the design and its
reasons: the stack, the architecture, the repository layout and the testing
approach. The rules that follow from it are in [`.claude/rules/`](.claude/rules/),
indexed in [`CLAUDE.md`](CLAUDE.md).

## Credits

[`CREDITS.md`](CREDITS.md) lists the external work Piano Touch Lab reuses: David C.
Stanwood's standard curves, the fonts, the shadcn/ui components and the
libraries the build ships, with their licenses.
