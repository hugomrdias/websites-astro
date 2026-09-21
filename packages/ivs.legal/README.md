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

## Article structured data

Article pages emit Article JSON-LD from Notion: `title` → `headline`, `description`, `publishedAt` → `datePublished`, `author`, `lang` → `inLanguage`, and the localized `category` → `about`. IVS Legal is the publisher and the existing fallback author when `author` is blank; named authors are represented as people. Canonical page URLs supply `mainEntityOfPage`. Published translations sharing `translationKey` are linked as versions of one creative work, without assuming which language was written first.

`dateModified` uses Notion's built-in `last_edited_time`, already retained by the loader. It reflects page edits, including metadata edits, not a legal review or the build time. No new database properties are required. For a personal byline, fill the existing `author` text property with that person's name. A separate editorial-update or legal-review date would require an explicit Notion Date property and a loader mapping; neither is currently tracked.

Article freshness uses the same Notion edit timestamp in the visible localized “Updated” date, JSON-LD `dateModified`, Open Graph metadata, and sitemap `<lastmod>`. The sitemap integration reads the current build's article JSON-LD before generating its entries, and fails the build if an article timestamp is missing or invalid. Static pages omit `<lastmod>` because their content modification dates are not tracked. Rebuilding alone does not advance article dates.

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

`dist/server/wrangler.json` is the generated deployment configuration; it references both Worker code and `../client` assets. CI transfers all of `dist`, so the deploy job does not need to rebuild or select another environment. `scripts/prepare-build.mjs` removes the generated local `.dev.vars` preview file before artifacts can be uploaded. Never upload local `.env` or `.dev.vars` files.

PRs build staging artifacts without deploying. Manual workflow runs default to staging. Master pushes and Notion rebuild events deploy production. Validate staging first, then merge through review; retain the previous Cloudflare version for rollback. Only remove legacy provider secrets after checking production delivery.

## Static output checks

After artifact preparation, the read-only `scripts/verify-build.mjs` verifies generated Markdown and every `/llms.txt` link, plus the presence of required icon, 404, and `/sw.js` files. Missing pages return 404; `/api/*` runs before static fallback. `.md` files use `text/markdown`; ordinary URLs remain HTML, including for AI crawlers.

## Icons and retired service worker

[`astro-favicons`](https://github.com/ACP-CODE/astro-favicons) generates favicons and platform metadata from `public/favicon.png` during development and builds, and supplies their head tags through `localizedHTML` in the shared layout. Explicit rendering avoids relying on its middleware’s route-header detection during Astro prerendering. To update the icons, replace that source and rebuild; no separate generation command or checked-in generated assets are needed.

The integration provides ICO, PNG and SVG favicon outputs, Apple touch and Safari pinned-tab icons, Android icons referenced by the web manifest, and Windows/Yandex assets with their metadata. SVG output from the PNG source remains raster-based; use a vector source if true scalable artwork is needed. The configuration preserves theme colour `#B99A4B`, background `#222221`, and the IVS Legal name. Head reordering is disabled. The manifest uses browser display mode; no service worker is registered and no offline caching is installed.

This replaces issue #16's original standalone-generator/checked-in-assets approach. The manifest is retained for platform icon discovery independently of service-worker retirement.

`public/sw.js` preserves the former Vite PWA retirement worker. Keep serving it at **`/sw.js` indefinitely**, including after future hosting or routing changes. It must return HTTP 200 JavaScript directly, never a redirect, HTML fallback, or 404. Returning visitors may still have the original caching worker: the browser must be able to update it at the same URL to unregister it, clear old caches, and reload its clients. The retirement worker has no fetch handler or caching logic. Do not register it from new pages.

Before production rollout, validate on the same origin with fresh browser storage, with the original caching worker, and after the intermediate retirement deployment. Check that old registrations and caches disappear, Portuguese and English pages retain their icons, and reloads/navigation do not loop. Production rollout uses the existing deployment workflow.
