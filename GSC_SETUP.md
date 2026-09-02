# Google Search Console setup — eteleorman.ro

This guide supports **sitemap submission** and **performance reporting**. It does **not** claim that Indexing API usage will index ordinary editorial articles.

Do **not** use Google's Indexing API as a bulk indexing solution for news/blog URLs.

Do **not** call the retired sitemap ping endpoint.

Do **not** commit credentials.

## 1. Prerequisites

1. Verify ownership of `https://eteleorman.ro` in [Google Search Console](https://search.google.com/search-console).
2. Prefer the URL-prefix property `https://eteleorman.ro/`.
3. Create a Google Cloud project (or reuse an existing one).
4. Enable **Google Search Console API**.

## 2. Service account (recommended for scripts)

1. Create a service account in Google Cloud IAM.
2. Create a JSON key and store it **outside** the repo (e.g. `~/.config/gsc/eteleorman.json`).
3. In Search Console → Settings → Users and permissions, add the service account email as a user with at least **Owner** or full permission required for sitemap API.
4. Export:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$HOME/.config/gsc/eteleorman.json"
export GSC_SITE_URL="https://eteleorman.ro/"
export GSC_SITEMAP_URL="https://eteleorman.ro/sitemap-index.xml"
```

## 3. Optional dependency

```bash
npm i googleapis
```

`googleapis` is intentionally not a hard dependency of the site runtime.

## 4. Commands

```bash
npm run gsc:sitemap-list
npm run gsc:sitemap-submit
```

## 5. Weekly indexing hygiene (manual / light automation)

1. Confirm `https://eteleorman.ro/sitemap-index.xml` returns 200.
2. Confirm child sitemaps (`sitemap.xml`, `news-sitemap.xml`, `sitemap-articole.xml`, …) return 200.
3. In GSC, check **Sitemaps** for discovered vs submitted URL counts.
4. Sample recent `/post/{slug}/` URLs in URL Inspection (do **not** automate abusive inspection volume).
5. Compare published article count (`npm run seo:articles`) with GSC coverage trends.
6. Review soft-404 / not-found spikes after deploys.

## 6. Environment template

See `.env.example` for variable names. Copy to `.env.local` (gitignored) when needed.

## 7. What success looks like

- Sitemap accepted in GSC without fetch errors.
- New articles appear under discovered/crawled URLs over time.
- Coverage issues decline for 404s caused by old incorrect `/stiri/{slug}/` sitemap entries after Google recrawls.

Indexing and Discover traffic are **not guaranteed** by these steps.
