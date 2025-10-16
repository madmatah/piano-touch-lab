/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as sortKeysFix from 'eslint-plugin-sort-keys-fix';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  reactHooks.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      'sort-keys-fix': sortKeysFix,
    },
    rules: {
      'sort-keys-fix/sort-keys-fix': 'warn',
    },
  },
  {
    ignores: [
      './build.ts',
      './config/',
      './src/components/ui/**/*.tsx',
      './dist/**',
      './bun-env.d.ts',
      './eslint.config.js',
    ],
  },
);
