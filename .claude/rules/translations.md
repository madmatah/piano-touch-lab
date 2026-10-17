---
paths:
  - 'src/**/*.ts'
  - 'src/**/*.tsx'
  - 'src/locales/**'
  - 'src/lib/i18n.ts'
  - 'src/lib/format/**'
  - 'src/hooks/use-translation.ts'
  - 'src/components/pages/HelpPage.tsx'
  - 'config/i18next-parser.config.cjs'
---

# Translations

The interface is written in English and translated into French. The English text lives in the code, as the keys of the catalogs, and the French text in `src/locales/fr/`.

## Catalogs

- **A key is its English source text:** `t('Target')`, from the `useTranslation` hook of `src/hooks/use-translation.ts`. Two namespaces exist: `translation`, the default, and `navigation`, for the sidebar, the menus and the names of the pages.
- **A count is a plural, never a sentence built around a number:** `t('{{count}} springs', { count })`, with its `_one` and `_other` forms in English and its `_one`, `_many` and `_other` forms in French, each written out in the singular or the plural it stands for.
- **`bun i18n` writes the catalogs** from the code: it adds the new keys, with the English text as their English value and an empty French value, and removes the keys nothing uses any more. Run it after any change to the text users see, then fill every empty French value. Never edit a key by hand in a catalog.
- **`bun i18n:check` fails on a missing key or an empty translation,** in the gate, so a string added without its French value cannot reach `main`.
- **A concept keeps one name in each language.** The terms of the trade, in English and in French, are the ones of the glossary of the Help page (`src/components/pages/HelpPage.tsx`): a term changes there and everywhere it appears, in the same change.

## Numbers and units

- **A number reaches the page through the formatters of `src/lib/format/`,** never through `toFixed` or string concatenation: they write it in the language the interface is shown in, with its decimal comma in French, the real minus sign, a fixed precision for the weights of a column, and a space that never breaks between a number and its unit.
- **A field reads what its reader types in their language,** a decimal comma included, and refuses a value with anything after the number rather than cutting it short.
- **Each language writes its own punctuation,** such as the space before a French colon: punctuation belongs to the translated string, never to the code around it.
