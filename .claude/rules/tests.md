---
paths:
  - 'src/**/*.test.ts'
  - 'src/**/*.test.tsx'
  - 'config/test/**'
  - 'scripts/**'
  - 'bunfig.toml'
---

# Tests

Tests are the specification of the business rules: to learn how a part of the system behaves, read its tests.

## Writing a test

- **One top-level `describe` per unit, named after it:** `The TouchWeightAnalyzer class`, `The feltBalanceWeight() function`, `The useAdjustmentRows hook`, `The NumericSelector component`, `The DEMO_DESIGN constant`. A class gets one nested `describe('The <method>() method')` per method. Several exports of one module share its test file, each with its own top-level `describe`.
- **A scenario and its outcome state one rule, in domain vocabulary:** a `describe('When …')` names the situation, and each `it('should …')` inside it one expected behavior: `When the up weight is missing` › `should leave the balance weight unknown`. The outcome names what the rule guarantees, not a generic `should return the expected value`.
- **One rule per test.** The body reads arrange, act, assert, with no branching: shared inputs and the result are declared with `let` at the scope of the suite, assigned in `beforeEach`, and asserted in `it`. Prefer one expectation per test; a few tightly related ones are fine. Inputs are named values (`fakeUpWeight`), not unexplained literals.
- **A throwing case** assigns `act = () => …` in `beforeEach` and asserts `expect(act).toThrowError()`.
- **Shared fake data lives in the most common enclosing `describe`,** and a test never mutates a shared input, so that the tests stay independent.
- **No comments in tests.** The names of the `describe` and the `it` say what a comment would.
- **`it.each` only for a simple table of data,** wrapped in a `describe('When …')` that names what the rows have in common.
- **A bug fix starts with a test** that reproduces the bug.
- **Floating point:** compare with a tolerance (`toBeCloseTo`), unless bit-exactness is the rule under test.
- **No test depends on timing, the wall clock or the order of the tests,** and randomness is seeded, or reports its seed, so that a failure replays.
- **A deleted test, or a loosened expectation, states its reason** in the change.

## Levels

- **Unit tests** run with `bun test` in the gate, on happy-dom, with Testing Library, i18next and the jest-dom matchers preloaded by `bunfig.toml`. A test file is named `<module>.test.ts(x)` and sits next to the module it documents. It imports from `'bun:test'`, takes the code under test from its sibling module (`./front-weight-calculator`), and other modules through the `@/` alias.
- **Components and hooks** are tested with `@testing-library/react` (`render`, `renderHook`, `fireEvent`), wrapped in `KeyboardProvider` when they need a keyboard.
- **The figure check,** `bun check:figures` (`scripts/check-figures.ts`), measures every figure of Analyze and Design in a real browser, on screen in six windows and printed on three sheets, against a dev server that is already running. It is outside the gate, since it needs a browser and a server: run it before calling done a change to a chart, a figure, the layout of a page or its print.
- **A test that needs a real browser or a running server** stays out of `bun test`, as the figure check does, so that the unit tests stay fast and need no outside resource.

## Test support

- **A fake implements the port it stands in for,** and refuses what the real implementation refuses, so that the code under test behaves the same on it as on the real one.
- **Only tests import test support.** It lives in `config/test/` or in the test file itself, outside the code the build bundles.
