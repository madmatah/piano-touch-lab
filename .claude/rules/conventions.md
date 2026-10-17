# Code conventions

These rules apply to code, tests and configuration, in every part of the repository. Code that predates them follows them when a change touches it.

## Naming

Names carry the meaning that comments may not carry.

- **Explicit, in the vocabulary of the domain.** A name says what a thing is or does: `balanceWeight`, `computeStrikeWeightRatio`, `isMeasured`. A concept keeps one name everywhere: in the documents, the code, the tests and the English catalog. The trade's terms are David C. Stanwood's: front weight, strike weight, strike weight ratio, balance weight, friction weight, wippen radius weight, key weight ratio, support spring.
- **No generic names:** `data`, `info`, `value`, `item`, `result`, `temp`, `obj`, `manager`, `handler`, `helper`, `util`.
- **No abbreviations and no single letters.** Write `keyIndex`, not `i`; `strikeWeightRatio`, not `swr`; `event`, not `e`. The abbreviations of the trade (FW, SW, SWR, BW) appear only in the text users see, never in identifiers. Type parameters are named too: `Payload`, not `T`.
- **Acronyms are written as words:** `titleId`, `getSvgPath`. Only the acronyms established on the platform are allowed: `id`, `url`, `json`, `ui`, `i18n`, `svg`, `css`, `html` and `dom`. Anything else is spelled out.
- **Booleans are predicates:** `isMeasured`, `hasSupportSprings`, `canPrint`.
- **Functions start with a verb:** `computeBalanceWeight`, `formatGrams`. A React component or hook follows the idiom of [TypeScript](#typescript) instead. Types and values are nouns.
- **Casing:** types, interfaces, classes and React components in PascalCase; functions, hooks, variables and object keys in camelCase; constants of a module in UPPER_SNAKE_CASE (`PLOT_INSET`, `DEFAULT_KEY_WEIGHT_RATIO`); files and folders in kebab-case, except a file that holds a React component, named after it in PascalCase (`KeyboardChart.tsx`). A file is named after the concept it holds, and so is its test (`keyboard-factory.test.ts`).
- **Only the language idioms listed in [TypeScript](#typescript) override these rules.**

## Units

- **Every weight is in grams, and its name says weight, not grams.** In David C. Stanwood's metrology, the down, up, front, balance and friction weights are forces at the front of the key, while the strike weight is weighed at the hammer's strike line and the wippen radius weight at the capstan, and both reach the key through their ratios. The trade names each one a weight: `downWeight`, `upWeight`, `frontWeight`, `strikeWeight`, `balanceWeight`, `frictionWeight`, `wippenRadiusWeight`. A name ending in `Weight` is therefore in grams, and carries no `Grams` suffix. These names are also keys of the stored data and of the backup file, which a rename would break.
- **A ratio has no unit and no suffix:** `strikeWeightRatio`, `keyWeightRatio`.
- **Any other quantity that has a unit carries it in its name, spelled out in full:** `marginMillimeters`, `chartHeightPixels`. Discrete units count too: `keyCount`, `whiteKeyCount`. A CSS length written as a string carries its unit in the string (`'12mm'`).
- **A type that carries the unit replaces the suffix,** and a name that repeats it could contradict it.
- **A vector or a structure carries its unit, and the axis or the field is a property:** `insetPixels.top`, never `topInsetPixels`.
- **Keys are counted from 1, from the bass.** `key.number` runs from 1 at the lowest key to the size of the keyboard at the highest, and every per-key array of the stores is indexed by `key.number - 1`. A layout is given by its first note and its number of keys, so a keyboard is not assumed to have 88.
- **A `NaN` never spreads silently.** A value not measured yet is `null`, never `NaN`, and a computation that needs it returns `null` in turn, unless the domain gives the missing value a meaning, as it does to support springs that were not measured, which count as none. Guard every division by a quantity that can be missing or reach zero, such as the strike weight and the strike weight ratio, which the equation of balance divides by, and the count of an average over keys, some of which may be unmeasured. Property tests drive the computations with arbitrary inputs and check that every output stays finite or `null` (planned).

## Comments

The names and the structure say what the code does, and the tests state the business rules, so a comment can only add a why.

- **No comments, except a why.** A comment never says what the code does.
- **A business rule is never a comment.** It is a test whose name states it.
- **A why is a last resort,** written only when neither the code nor a test can say it. Typical cases: a workaround for a platform or library bug, with its link; a constraint taken from a reference, with its source, such as a curve taken from David C. Stanwood's articles or a condition of a license.
- **A documentation comment follows the same rule.** A doc block that restates the signature, carries tags such as `@param` or `@returns`, or says what the code does is forbidden: the names and the types already say it. One that gives a why is a comment like any other.
- **Allowed directives,** as comments: the ESLint suppression comment (`eslint-disable-next-line <rule>`), `@ts-expect-error`, and triple-slash references. A directive that suppresses a check states its reason after `--`.
- **A version label next to a pinned commit SHA is allowed,** such as `# v7.0.1` after an action in a GitHub Actions workflow: it names the release, which the SHA cannot say.
- **Forbidden:** commented-out code, and banners.
- **Scope:** every file but prose documents, configuration and scripts included. No tool of the gate checks comments: the review does.

## TypeScript

- **Strict,** with `noUncheckedIndexedAccess`, as `tsconfig.json` sets them: an indexed read is `T | undefined`, and the code says what happens when it is missing.
- **Named exports only.** A configuration file that a tool reads through its default export is the exception.
- **Erasable syntax only:** no `enum` and no `namespace`, but unions of literals and `as const` objects. They are plain values, which the stores and the backup file save as they are, and types that leave no code behind, where an `enum` emits an object of its own. The decorators of the service container (`@injectable`, `@inject`) are the exception: inversify needs them, with `reflect-metadata`.
- **No `any`.**
- **Type-only imports say so** (`import type`), as `verbatimModuleSyntax` requires.
- **A switch over a union whose cases must all be handled ends with a `never` check,** in a `default` that throws, unless each case returns a value that the function's return type requires, which the compiler checks itself: a new case then fails to compile at every switch that forgets it.
- **A function passed as a callback does not depend on `this`.** A class method passed as a callback is an arrow-function field, or the caller wraps it (`() => smoother.smooth(points)`). Neither the compiler nor the linter catches an unbound method.
- **No `console`.** Code logs through the injected logger, `useLogger()` in a hook or a component, and ESLint fails on `console`. The scripts of `scripts/` and the build (`build.ts`) print to the terminal, which is their whole output.
- **The keys of an object literal are sorted** alphabetically, as `sort-keys-fix` checks, so that two objects of the same shape read alike and a merge never reorders them.
- **For the allowed directives above:** `@ts-ignore` and `@ts-nocheck` are refused, since they outlive the errors they silence; `@ts-expect-error` fails once its error is gone.
- **Idioms that override the naming rules:**
  - a React component is a noun in PascalCase (`KeyboardChart`), and a hook a camelCase name starting with `use` (`useAnalyzedKeyboard`), in a file named `use-analyzed-keyboard.ts`;
  - a port is an interface named `<Concept>Requirements` in a `<concept>.requirements.ts` file, with the `Symbol` that binds it, named `<concept>RequirementsSymbol`; a few older ports spell their file `<concept>-requirements.ts` or their symbol `<concept>Symbol`, and keep those names until a change renames them;
  - a fake value of a test starts with `fake` (`fakeKeyboard`);
  - a name the platform or a library imposes, such as ECharts' `getDom` or React's `children`.

## Input from outside the program

- **Outside input is checked before use.** A backup file the user loads, what the browser's `localStorage` returns, the address and its parameters, and the numbers typed into a field are checked for their shape and their bounds. Malformed input fails cleanly, with a message the user can read, without crashing the page or corrupting the stores.
- **The backup file is checked against the schemas of `src/lib/backup/measure-backup.ts`** before anything is written to a store.
- **The page requests nothing from another site** but the analytics script of the demo, which only the demo build adds (`APP_ENV=demo`): the fonts are self-hosted, since a request to a CDN would hand the visitor's address to a third party.
- **Outside text never reaches a parser of markup, script, styles or addresses.** React escapes the text it renders: never `dangerouslySetInnerHTML`, `innerHTML` or `insertAdjacentHTML`, and never an `href`, a `src` or an inline style built from outside text. i18next leaves its interpolations unescaped for React to escape, so a translated string reaches the page only through `t()` or `<Trans>`.
