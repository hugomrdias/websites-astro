# Articles

The Portuguese `/articles` and English `/en/articles` share templates in `src/components/articles`. Each article has its own generated route. Header language links find the matching `translationKey`; if a translation is missing, they return to the other language's listing.

## Content

`src/content.config.ts` defines the `articles` collection, currently loaded from Markdown in `src/content/articles/{pt,en}`. The six pairs are demonstration content. Sample articles and listings containing only samples have `noindex` metadata.

Required frontmatter: `title`, `description`, `lang` (`pt` or `en`), `translationKey`, `category`, `publishedAt` (ISO date). Optional fields: `slug` (generated from the title when omitted or blank), `author` (defaults to IVS Legal), `featured`, `draft`, `sample` (all default to false).

Slugs must be unique within each language; use a shared, unique translation key for each article pair. Categories use stable English IDs; only their UI labels are translated. Drafts are excluded from listings, generated routes, translations and related articles. Articles sort newest first; the newest featured article leads the listing. Reading time derives from the Markdown body. Level-two headings populate the article contents navigation.

## Automatic slugs

Leave `slug` out of Markdown frontmatter, or leave the optional Notion Text property blank. The collection generates a slug from `title` during content loading: lowercase, remove accents and apostrophes, replace spaces/punctuation with hyphens, and trim leading/trailing hyphens. For example, `Proteção de dados: o que muda?` becomes `protecao-de-dados-o-que-muda`.

No Notion formula or automation is needed. A nonblank `slug` overrides the generated value and must use lowercase ASCII letters, numbers and single hyphens. Missing, empty, whitespace-only and `null` values all use the title. If the title produces no usable slug (for example, punctuation only), provide an explicit slug. Published articles with duplicate slugs in the same language fail the build; the same slug in different languages is allowed.

Editing a title changes its generated URL on the next build. To keep a published URL stable, copy its current slug into the optional `slug` field before renaming the title. The featured sample pair keeps explicit short slugs as examples; the remaining samples generate theirs from their titles. Entry IDs are based on local file paths (and should use Notion page IDs later), independently of public URLs.

## Categories

`src/lib/article-categories.ts` defines the allowed IDs, filter order, and Portuguese/English labels. Practice-area headings, contact-form choices and team specialty labels also use these shared labels. `category` is required and validated as an enum: unknown IDs and display labels are rejected. Use the same ID for both translations of an article.

| ID                | Portuguese            | English         |
| ----------------- | --------------------- | --------------- |
| `civil-law`       | Direito civil         | Civil Law       |
| `corporate-law`   | Sociedades comerciais | Corporate Law   |
| `employment-law`  | Direito do trabalho   | Employment Law  |
| `real-estate-law` | Direito imobiliário   | Real Estate Law |
| `criminal-law`    | Direito penal         | Criminal Law    |
| `immigration-law` | Imigração             | Immigration Law |

For example, use `category: civil-law` in frontmatter. All defined categories appear in the filters, even if a category has no published articles in the current language. Search matches the translated category label; filters and related-article matching use the ID.

To add a category, add its ID to `articleCategoryIds` and supply both labels in the same module. The schema and filters use that list automatically. The future Notion loader should map its category property to one of these IDs.

## Set up the Notion database

This is the database contract for the future loader. The site currently reads local Markdown; creating this database does not connect it or publish its content.

### Create the database and properties

Create a full-page database named **IVS Legal Articles** with a table view and one data source. Use one row (page) per article **per language**, with both languages in the same database. Keep property names and select values in English, exactly as below; article text can be Portuguese or English.

Rename Notion's existing title property to `title`, then add the other properties. The types below correspond to [Notion database property types](https://www.notion.com/help/database-properties). “Required” describes this site's content contract; it is not a Notion form requirement.

| Property         | Notion type | Required value / behaviour                                                                                                                                                              |
| ---------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`          | Title       | Required. The article heading, in the row's language.                                                                                                                                   |
| `description`    | Text        | Required. A short summary for previews and page metadata.                                                                                                                               |
| `slug`           | Text        | Optional override. Leave blank to generate from `title`. To keep a published URL stable, set its existing slug here. Explicit values use lowercase letters, numbers and single hyphens. |
| `lang`           | Select      | Required. Create exactly two options: `pt` and `en`.                                                                                                                                    |
| `translationKey` | Text        | Required. A stable shared key for a translation pair, such as `contracts-before-signing`. Use a different key for each distinct article and at most one row per key/language.           |
| `category`       | Select      | Required. Create the six IDs listed under Categories above, exactly as written. Use Select, not Multi-select: each article has one category.                                            |
| `publishedAt`    | Date        | Required. A single publication date, without an end date. Use a date without a time for the current date-only display.                                                                  |
| `author`         | Text        | Optional. Display name; the loader should map a blank value to `IVS Legal`. Use Text rather than Person to avoid requiring a Notion account for each author.                            |
| `featured`       | Checkbox    | Unchecked by default. Check to feature the article; the newest checked article in each language wins. If none is checked, the newest article is featured.                               |
| `draft`          | Checkbox    | Check while writing. Checked articles are excluded from the site. The collection defaults to `false`, so explicitly check this in the new-article template.                             |
| `sample`         | Checkbox    | Leave unchecked for real articles. Check only for demonstration content: it remains visible but gets the sample notice and `noindex` metadata.                                          |

Use the same `category` ID for both translations. Do not add Portuguese labels as additional select options: the site supplies the translated labels. New categories must first be added to `src/lib/article-categories.ts`.

### Write and translate articles

Open a row as a page and write the article in its **page body**, below its properties. There is no `body` property to create. Use paragraphs, Heading 2 sections, Heading 3 subsections, lists, links and quotes. The site renders the title as Heading 1, and Heading 2 sections become its contents navigation. Reading time is calculated from the imported body.

For example, create these two rows, each with its own description and body:

| Property         | Portuguese row                            | English row                               |
| ---------------- | ----------------------------------------- | ----------------------------------------- |
| `title`          | Antes de assinar, tempo para compreender. | Before you sign, take time to understand. |
| `slug`           | Leave blank                               | Leave blank                               |
| `lang`           | pt                                        | en                                        |
| `translationKey` | contracts-before-signing                  | contracts-before-signing                  |
| `category`       | civil-law                                 | civil-law                                 |
| `publishedAt`    | 2026-09-20                                | 2026-09-20                                |
| `draft`          | Checked while writing                     | Checked while writing                     |
| `sample`         | Unchecked for real content                | Unchecked for real content                |

With `slug` blank, these examples generate `antes-de-assinar-tempo-para-compreender` and `before-you-sign-take-time-to-understand`. A translation can be added later. When no published translation exists, the language switch leads to the other language's article listing.

Create an **Article draft** [database template](https://www.notion.com/help/database-templates) from the dropdown beside **New**. Set `draft` checked, `featured` and `sample` unchecked, and `author` to `IVS Legal`. Leave the title, translation key, category and publication date for the author to fill in; leave `slug` blank for automatic generation. Optionally create separate Portuguese and English templates with `lang` preselected. Create new articles from these templates to retain the draft setting.

After the loader is connected, complete the metadata and body, review the article, clear `draft`, then rebuild and deploy the site. A future `publishedAt` date currently does **not** schedule publication: an article with `draft` unchecked is included on the next build regardless of its date. Filtering a Notion table view does not control publication; the loader must honour `draft`.

### Give the future loader access

1. As a workspace owner, create an internal connection named **IVS Legal Website** in Notion's Developer portal. Enable **Read content**; the article loader does not need write capabilities.
2. Grant that connection access to the articles database through its **Content access** settings, or the database page's **••• → Connections → Add connection** menu. Its article pages inherit access. The database does not need to be published to the web. Keep the installation token in a local environment file and the deployment's secret store, not in source code or client-side variables. See [Notion's internal connection guide](https://developers.notion.com/guides/get-started/internal-connections).
3. Save the database URL/ID and the specific data source ID for the loader setup. Notion exposes **Copy data source ID** under **Manage data sources** in the database settings. Database and data source IDs are distinct; APIs using the data source model query the latter. See [Notion's data source migration guide](https://developers.notion.com/guides/get-started/upgrade-guide-2025-09-03).

Suggested environment variable names for the future implementation are `NOTION_TOKEN` and `NOTION_DATA_SOURCE_ID`. These are not configured or consumed by `ivs.legal` yet; confirm the selected loader's ID requirements before adding them. A loader using the older database API may instead require `NOTION_DATABASE_ID`.

The loader must convert Notion title/text properties to plain strings, select properties to their option names, `publishedAt` to its start date, and checkboxes to booleans. It must pass a missing or blank `slug` through the collection schema so the title fallback runs, supply the other schema defaults for blank optional values, validate required metadata, and import page content into the rendered body described below.

## Future Notion loader

Replace `glob(...)` in `src/content.config.ts` with a build-time Notion loader that maps properties to the same schema. Keep stable entry IDs and a Markdown `body`. A custom loader must also populate Astro's rendered content (using `parseData`, `renderMarkdown`, and `store.set`) so `render(article)` continues to supply the article component and heading index. The shared query helpers in `src/lib/articles.ts` and the page templates are independent of the content source.

Remove the demonstration entries when connecting real content, and leave `sample` false for reviewed articles. Rebuild to publish content changes. No Notion credentials or integration are required for the local samples.

## Preview

Run `pnpm --filter ivs.legal dev` from the workspace root and open `/articles` or `/en/articles`. The site uses its existing `.env` configuration. Search matches titles, descriptions and categories, ignoring case and accents. Filters combine with search. “View more” reveals three additional matches at a time. With JavaScript disabled, all articles remain accessible and interactive controls are hidden.
