---
paths:
  - 'src/**/*.tsx'
  - 'src/hooks/**'
  - 'src/contexts/**'
  - 'src/components/**'
  - 'config/react-compiler-plugin.ts'
  - 'styles/globals.css'
---

# React

The React Compiler compiles every component and hook of `src/` but the domain and the tests (`config/react-compiler-plugin.ts`), for the dev server and the build alike. It memoizes what each render computes, which holds only for code that follows the Rules of React. The rules below are the ones this code relies on that no check of the gate enforces.

## Rendering

- **Read a store through `useStore(store, selector)`,** never `useXStore()(selector)`. The compiler does not recognize the second form as a hook call, so nothing guarantees that the store is read again on the next render.
- **Give each `<Trans>` the `t` of its component** (`<Trans t={t} i18nKey="…">`). Memoized without it, a `<Trans>` no longer follows a change of language.
- **Read nothing that changes during a render:** no `window`, `document`, `localStorage` or clock in the body of a component or a hook. Read them in an effect, an event handler or a hook that subscribes to them: the printed date, for instance, comes from a hook that takes it when the page is printed, where a render would have frozen it.
- **Keep the stylesheet's sources on `src/`.** `styles/globals.css` declares `@source '../src'`, since the Tailwind plugin no longer sees the files that the compiler rewrites.

## Stores

- **A store file exports narrow selector hooks,** built with `useShallow`, and its callers read only what they show, so that a change elsewhere in the store does not render them again.

## Charts

- **Every chart over the keys is a `KeyboardChart`:** ECharts on the key axis of the keyboard's placement (`computeKeyboardPlacement`), the same placement that draws the keyboard under the chart, so that each key's point sits above its key. It takes `TouchDesignSerie[]` (`src/components/charts/interfaces.ts`), built with `useGenerateSerie`. A new chart over the keys builds on it.
- **On screen and on paper alike.** A figure takes its size from the sheet the reader chose when the page is printed, so a change to a figure is checked printed too, by the figure check (`.claude/rules/tests.md` > Levels).
