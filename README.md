# websites-astro

> Monorepo for Astro websites

## Packages

- [hugodias.me](https://github.com/hugomrdias/websites-astro/tree/master/packages/hugodias.me) - Personal website
- [ivs.legal](https://github.com/hugomrdias/websites-astro/tree/master/packages/ivs.legal) - IVS Legal website
- [decentralised.dev](https://github.com/hugomrdias/websites-astro/tree/master/packages/decentralised.dev) - Decentralised Experience website

## Development

[Turborepo](https://turborepo.dev) runs the package tasks:

```sh
pnpm dev
pnpm lint --filter=hugodias.me
pnpm build --filter=hugodias.me
```

CI checks only the sites a change affects. Each pull request gets a [Worker Preview](https://developers.cloudflare.com/workers/previews/) per affected site, linked in a pull request comment. The Previews are deleted when the pull request closes.
