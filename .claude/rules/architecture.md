---
paths:
  - 'src/**'
  - 'scripts/**'
  - 'config/**'
  - 'build.ts'
  - 'package.json'
---

# Architecture

The project follows Clean Architecture, in four layers, and applies SOLID to modules, functions and types. React is the platform of every layer but the domain.

## Layers

- **Four layers, from the inside out:** the domain, the application, the adapters and the composition roots. A module's layer is the directory it lives in:
  - the domain: `src/lib/`, and the demo piano of `src/demo-data/`;
  - the application: `src/hooks/`, `src/contexts/`, and every `hooks/` folder under `src/components/`;
  - the adapters: the rest of `src/components/` (pages, charts, print, the components of `src/components/ui/`), the drawings of `src/assets/`, and the translation catalogs of `src/locales/`;
  - the composition roots: `src/frontend.tsx` and `src/App.tsx` in the browser, `src/app-container.ts` and `src/container-modules/` for the services, `src/components/AppRouter.tsx` for the pages, `src/index.tsx` for the server, `build.ts` and `config/` for the build and the plugins of the dev server, the scripts of `scripts/`, and the tests.
- **Dependencies point inward.** An inner layer never refers to an outer one: no import, no type, no name. The domain depends only on the domain, the application on the domain, the adapters on the application and the domain, and the composition roots on every layer. A library of plain values that does no I/O and reads no clock, such as `clsx` or `date-fns` used as pure functions, may serve any layer. The domain's services also carry the decorators of the service container (`@injectable`, `@inject` from inversify), the one framework the domain imports.
- **The domain imports neither React, zustand, i18next nor the browser:** no `window`, no `document`, no `localStorage`. The React Compiler leaves `src/lib/` out for that reason.
- **No dependency cycle,** between modules of the same layer included.

## Ports and wiring

- **Inner layers own their ports.** When the domain or the application needs a service that can vary, such as a curve smoother or the logger, it declares an interface in its own vocabulary, in a `<concept>.requirements.ts` file with the `Symbol` that binds it, and an implementation satisfies it.
- **Services are bound in one container, `src/app-container.ts`,** with its modules in `src/container-modules/`: each port's `Symbol` to its implementation, or to several implementations told apart by name, as the curve smoothers are by `SmoothStrategy`. A hook or a component reaches a service only through `useInjection(symbol)`, or `useNamedInjection(symbol, name)` for a named binding. A new service follows the same path. No other container or service locator, and no service instance created or kept outside the container.
- **A store is created once, lazily, in its file under `src/hooks/store/`,** and reached only through its `use<Concept>Store()` hook and the narrow selector hooks of that file. No other module-level mutable state is shared between callers.
- **Plain data crosses boundaries:** values whose types belong to the inner side. No React, ECharts or zustand type crosses into the domain.
- **A module's public API is its entry point.** Where a folder has an `index.ts`, what it exports is imported from it, never from the file behind it.

## Responsibilities

- **The domain holds the rules and is pure:** the keyboard model, the touch weight metrology and its equations of balance, the standard curves, curve smoothing, music theory, the shape of the backup file, the formatting of numbers. No I/O, no clock, no global mutable state, no framework, no platform API.
- **The application orchestrates.** Its hooks read the stores, pass the measurements to the domain, call its services and assemble what the pages show. Any rule they need belongs in the domain.
- **Adapters translate, nothing more.** A component turns what a hook returns into markup, a chart or a printed sheet, and the user's actions into calls of the application. It holds no business rule.
- **Composition roots decide no rule either.** They bind the services, mount the providers and declare the routes.

## Keyboard model

- **Per-key data flows through the keyboard.** `Keyboard` (`src/lib/piano/keyboard/`) is an immutable list of `Key`, built by `KeyboardFactory.fromLayout({ startNote, length })`. `keyboard.map(fn)` returns a new `KeyboardLike<KeyWith<T>>` whose keys carry a `payload`, and every per-key value goes through this chain rather than through raw arrays.
- **The keyboard is computed once per page.** `KeyboardProvider` builds it from the piano profile, and `KeyboardAnalysisProvider` measures, analyzes and designs it once (`useMeasuredKeyboard`, then `TouchWeightAnalyzer`, then the target series and `TouchWeightPreviewer`); every component reads the result from that context instead of computing it again. The measuring table is the one exception: each of its rows analyzes its own key as it is typed.

## Stored and shared data

- **What is stored or exported is plain data:** values that survive a round trip through JSON unchanged, with no class instance, no function and nothing the serialization drops or alters. This covers the five stores persisted to `localStorage` under a `ptl.*` key (piano profile, measures, measure options, design, application state) and the backup file that bundles four of them, all but the application state.
- **A store holds raw inputs only.** Whatever can be derived from them is derived by the application on each read, never stored, so that a stored value never disagrees with its source.
- **A stored shape is versioned, and the backup file follows it.** The stores of the measures, the design and the piano profile save a `version` with their state. The backup file carries the stores' states, checked by the schemas of `src/lib/backup/measure-backup.ts`, which follow the stores' shapes: a change to a store's shape changes its schema, and its `version`, in the same change.

## SOLID

- **Single responsibility.** A module, a function or a type has one reason to change, and a file holds one concept. A function whose name needs an "and" does two things. When a change to one rule forces edits across unrelated concepts, the responsibilities are mixed.
- **Open for extension.** A new case is added as data, or beside the existing cases, without rewriting the code that handles them: a new design mode adds its target series hook to the generators, a new smoother its binding.
- **Substitutable implementations.** Every implementation of a port, the fakes of the tests included, honors its whole contract: units, ordering, errors, missing values. The application behaves the same on a fake and on the real implementation.
- **Narrow ports.** A port offers only what its client uses, in the client's vocabulary, and nothing depends on methods it does not call.
- **Dependency inversion.** Policy depends on the abstractions it owns, the ports of the inner layers, never on a concrete technology.
- **No speculative generality:** no abstraction with a single caller and no rule behind it.

## Organization

- **Below the layer directories, folders, files and modules are named after domain concepts,** never after technical kinds: `utils`, `helpers`, `services`, `models` or `common`, nor their singulars. The top directories of `src/` (`lib`, `hooks`, `components`, `contexts`, `container-modules`) keep their technical names, since they declare the layers, and so do the `hooks/` folder of a feature folder and `src/lib/utils.ts`, the path that the shadcn/ui configuration (`components.json`) writes to.
- **A feature folder** of `src/components/`, such as `design/front-weight/` or `measures/`, holds its components, a `<Feature>.types.ts` file for their props, and a `hooks/` folder for its application hooks. A design mode and its target belong to the domain, in `src/lib/piano/touch-design/design/`, since the stores and the backup file save them.
- **A page** is a route component of `src/components/pages/`, declared in `src/components/AppRouter.tsx`, and wraps its content in `MainLayout`.
