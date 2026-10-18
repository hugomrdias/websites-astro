# AGENTS.md

- pnpm workspace of three independent Astro sites under `packages/`, with tasks run by Turborepo
- Dependencies used by more than one package (the root counts) live in the pnpm catalog; the rest keep their version in their own `package.json`
- Scope work to the site you are changing
- For Astro APIs, search current docs (`search_astro_docs`) before guessing

## Checks

After every change, run `pnpm lint --filter=<name>`, then `pnpm build --filter=<name>`, until both exit 0. Run them one after the other: `astro check` and `astro build` both write `.astro/`.

- `<name>` is the package `name`, which matches the directory
- Catalog or root-config edits: `pnpm lint` and `pnpm build`
- Turborepo hides environment variables a task does not declare. When a package starts reading a new variable, add it to that package's `turbo.jsonc`
- Fix formatting with `pnpm format`: Biome (`biome.jsonc`) lints everything and formats JS, TS, JSON and CSS; Prettier formats only `.astro` and `.yml`, because Biome's HTML formatter can change the whitespace Astro renders

`hugodias.me` `build` needs Playwright Chromium and `NOTION_TOKEN` / `NOTION_DATABASE_ID`. If those secrets are missing, report that and skip the build.

```sh
pnpm --filter hugodias.me exec playwright install --with-deps chromium
```

## Deploys

CI deploys each site with Wrangler and gives every same-repo pull request a Worker Preview named `pr-<number>`, under the top-level Worker in the site's `wrangler.jsonc`. Previews inherit no bindings or vars: when you add one to a Worker, decide whether Previews need it and repeat it under `previews`.
