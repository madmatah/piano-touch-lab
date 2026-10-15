import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as sortKeysFix from 'eslint-plugin-sort-keys-fix';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  reactHooks.configs.flat.recommended,
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
      'no-console': 'error',
    },
  },
  {
    // A command-line check reports to the terminal; that is its whole output.
    files: ['scripts/**/*.ts'],
    rules: {
      'no-console': 'off',
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
