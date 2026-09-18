import eslintPluginAstro from 'eslint-plugin-astro'
import * as mdx from 'eslint-plugin-mdx'

/** @type {import('eslint').Linter.Config[]} */
const config = [
  mdx.flat,
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: ['.vscode/', 'dist/', 'node_modules/', 'public/', 'dev-dist/'],
    rules: {
      // override/add rules settings here, such as:
      // "astro/no-set-html-directive": "error"
    },
  },
]

export default config
