# IVS Legal

Astro pages and Notion articles are prerendered. The Cloudflare adapter runs only the contact API on demand. Public HTML is served as static assets; Markdown is available at matching `index.md` URLs and indexed by `/llms.txt`.

## Development

Use Node 24 and the workspace pnpm version. Run from the repository root:

```sh
pnpm install
pnpm --filter ivs.legal types
pnpm --filter ivs.legal dev
pnpm --filter ivs.legal test
pnpm --filter ivs.legal lint
pnpm --filter ivs.legal build
pnpm --filter ivs.legal preview
```

The gitignored `.env` supplies build-time `NOTION_TOKEN`, `NOTION_DATA_SOURCE_ID`, `GOOGLE_MAPS`, and `TURNSTILE_SITE_KEY`. The Notion keys are not Worker secrets. Local builds default to Cloudflare's public Turnstile test site key; deployed builds must use the environment's real site key.

Store `TURNSTILE_SECRET_KEY` in gitignored `.dev.vars` for local development and in the Worker secret for each deployed environment. The public test site key uses Cloudflare's documented test secret; never use either on deployed sites. Automated tests mock token verification and email sending; no test sends real mail. Local email bindings are simulated (do not enable `remote: true`). The endpoint still checks hostname and action, so unit tests provide representative Siteverify responses.

## Contact flow

All four forms share the same component and post JSON to `/api/contact`. The handler validates the body (64 KiB maximum), field lengths, privacy consent, locale, legal area, and urgency. It checks the request origin, applies five attempts per minute per IP using a Cloudflare rate-limit binding, and verifies the Turnstile token's hostname and `contact` action. Rate limiting is approximate and per Cloudflare location, not a global quota.

Accepted messages are sent through `EMAIL` from `IVS Legal <website@ivs.legal>` to `geral@ivs.legal`, with the visitor as Reply-To. Sender and recipient are fixed and restricted by the binding. Staging subjects begin with `[STAGING]`. Both HTML and plain-text bodies include the submitted fields. There are no attachments, mailing-list subscriptions, visitor acknowledgements, database writes, queues, or automatic email retries.

The API returns uncached JSON `{ ok, code, requestId }`: 200 sent; 400 malformed/invalid fields; 403 origin or verification rejected; 405 method; 413 size; 415 content type; 429 rate limit; 503 upstream/configuration failure. Success means Cloudflare accepted the email, not confirmed inbox delivery. The form retains text on failure and refreshes Turnstile before retrying. Logs contain outcome and request/message IDs only, not contact details.

## Cloudflare setup

Configure separate managed Turnstile widgets restricted to `dev.ivs.legal` and `ivs.legal`. Upload each secret using the source Wrangler configuration:

The legacy Cloudflare redirect “Redirect from dev to Root” has been removed so staging reaches its own Worker. Staging assets carry `X-Robots-Tag: noindex, nofollow, noarchive`; production indexing is unchanged. Crawlers must be able to fetch these responses to see the noindex directive.

```sh
pnpm --filter ivs.legal exec wrangler secret put TURNSTILE_SECRET_KEY --config wrangler.jsonc
pnpm --filter ivs.legal exec wrangler secret put TURNSTILE_SECRET_KEY --config wrangler.jsonc --env production
```

Email Sending must be enabled for `ivs.legal`, with verified bounce/DKIM DNS. Preserve the domain's existing mailbox MX, SPF, and DMARC records. Bindings only permit sender `website@ivs.legal` and recipient `geral@ivs.legal`.

Set GitHub repository variables `IVS_TURNSTILE_STAGING_SITE_KEY` and `IVS_TURNSTILE_SITE_KEY`. Existing Notion and Google Maps GitHub secrets remain build inputs; `WEB3FORMS` and `HCAPTCHA` are no longer build inputs. Keep obsolete secrets until production verification succeeds.

## Build and deploy

The Cloudflare environment is selected at build time. Build staging without `CLOUDFLARE_ENV`; set `CLOUDFLARE_ENV=production` for production. Supply the corresponding real `TURNSTILE_SITE_KEY` in both cases.

```sh
CLOUDFLARE_ENV=production pnpm --filter ivs.legal build
pnpm --filter ivs.legal exec wrangler deploy --config dist/server/wrangler.json
```

`dist/server/wrangler.json` is the generated deployment configuration; it references both Worker code and `../client` assets. CI transfers all of `dist`, so the deploy job does not need to rebuild or select another environment. `scripts/prepare-build.mjs` copies generated icons into the static asset directory and removes the generated local `.dev.vars` preview file before artifacts can be uploaded. Never upload local `.env` or `.dev.vars` files.

PRs build staging artifacts without deploying. Manual workflow runs default to staging. Master pushes and Notion rebuild events deploy production. Validate staging first, then merge through review; retain the previous Cloudflare version for rollback. Only remove legacy provider secrets after checking production delivery.

## Static output checks

After artifact preparation, the read-only `scripts/verify-build.mjs` verifies generated Markdown and every `/llms.txt` link, plus forms, icons, 404 HTML, and the self-destroying `/sw.js`. Missing pages return 404; `/api/*` runs before static fallback. `.md` files use `text/markdown`; ordinary URLs remain HTML, including for AI crawlers.

The PWA integration remains in retirement mode. Its older output-path behaviour needs the build script to copy generated icons into `dist/client`; `/sw.js` is explicitly generated there. Do not delete or rename the retirement worker. Plugin removal and independent icon generation remain tracked in [issue #16](https://github.com/hugomrdias/websites-astro/issues/16).
