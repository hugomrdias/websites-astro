# AGENTS.md

- pnpm workspace of three independent Astro sites under `packages/`
- Shared versions live in the pnpm catalog
- Scope work to the site you are changing
- For Astro APIs, search current docs (`search_astro_docs`) before guessing

## Checks

After every change, lint then build the scoped packages until both exit 0.

- Filter by package `name` (it matches the directory)
- Catalog or root-config edits: `pnpm lint` and `pnpm build`

`hugodias.me` `build` needs Playwright Chromium and `NOTION_TOKEN` / `NOTION_DATABASE_ID`. If those secrets are missing, report that and skip the build.

```sh
pnpm --filter hugodias.me exec playwright install --with-deps chromium
```
