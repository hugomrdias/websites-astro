import eslint from '@eslint/js'
import eslintPluginAstro from 'eslint-plugin-astro'
import eslintConfigPrettier from 'eslint-config-prettier'
import * as mdx from 'eslint-plugin-mdx'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: [
      '.vscode/',
      'dist/',
      'node_modules/',
      'public/',
      'dev-dist/',
      '.astro/',
    ],
  },
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  mdx.flat,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs['jsx-a11y-recommended'],
  eslintConfigPrettier,
  {
    files: ['**/*.astro'],
    rules: {
      'no-undef': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    files: ['**/*.md'],
    rules: {
      'no-irregular-whitespace': 'off',
    },
  },
]

export default config
