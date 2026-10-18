# AGENTS.md

- pnpm workspace of three independent Astro sites under `packages/`
- Dependencies used by more than one package (the root counts) live in the pnpm catalog; the rest keep their version in their own `package.json`
- Scope work to the site you are changing
- For Astro APIs, search current docs (`search_astro_docs`) before guessing

## Checks

After every change, lint then build the scoped packages until both exit 0.

- Filter by package `name` (it matches the directory)
- Catalog or root-config edits: `pnpm lint` and `pnpm build`
- Fix formatting with `pnpm format`: Biome (`biome.jsonc`) lints everything and formats JS, TS, JSON and CSS; Prettier formats only `.astro` and `.yml`, because Biome's HTML formatter can change the whitespace Astro renders

`hugodias.me` `build` needs Playwright Chromium and `NOTION_TOKEN` / `NOTION_DATABASE_ID`. If those secrets are missing, report that and skip the build.

```sh
pnpm --filter hugodias.me exec playwright install --with-deps chromium
```
