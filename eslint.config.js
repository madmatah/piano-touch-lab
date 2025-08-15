/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as sortKeysFix from 'eslint-plugin-sort-keys-fix';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  {
    ignores: [
      './build.ts',
      './test/',
      './src/components/ui/**/*.tsx',
      './dist/**',
      './bun-env.d.ts',
      './eslint.config.js',
    ],
  },
);
