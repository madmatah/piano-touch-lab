import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as sortKeysFix from 'eslint-plugin-sort-keys-fix';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {},
  },
  {
    plugins: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  { ignores: ['./build.ts', './src/components/ui/**/*.tsx', './dist/**'] }
);
