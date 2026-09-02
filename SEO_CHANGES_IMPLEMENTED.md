# SEO changes implemented — eteleorman

**Branch:** `seo/crawlability-indexing-improvements`  
**Date:** 2026-07-31  
**Domain:** https://eteleorman.ro

No change guarantees indexing, rankings, Google News inclusion, or Discover traffic.

## Critical / high fixes

1. **Unified article URLs on live paths**
   - Rewrote `lib/articleRoutes.js` to emit `/post/{slug}/` and `/recomandare/{slug}/` only.
   - Removed Bucharest section heuristics (`/stiri/`, `/cultura/`, etc.) that 404 on this site.
   - Aligned `lib/postHref.js` with trailing-slash canonical paths.
   - Fixed `scripts/generate-search-index.js` URL generation.
   - Sitemaps using `getArticleUrlPath` now list crawlable URLs.

2. **News sitemap**
   - Added `src/pages/news-sitemap.xml.js` (≈ last 48 hours, non-promo editorial posts).
   - Kept references in `robots.txt` and sitemap index accurate.

3. **Soft 404s**
   - Empty `/categorie/{slug}/` and `/autor/{slug}/` now return `notFound: true`.

4. **RSS**
   - Canonical item URLs with trailing slash, author when present, larger newest window (50).
   - Feed autodiscovery in `_document.js` and `HeadMeta`.
   - `generate:rss` included in `prebuild`.

5. **Article metadata / structured data**
   - `NewsArticle` + `BreadcrumbList` JSON-LD (`@graph`) on `/post/[slug]`.
   - Publisher name from `publication.js`.
   - Related articles via deterministic `lib/relatedArticles.js` (category/tags/recency).
   - Robots directive already supports `max-image-preview:large` via `robotsDirective()`.

6. **Category pagination**
   - Server-rendered prev/next links; 24 posts per page; invalid pages 404.

7. **robots.txt**
   - Trailing-slash Disallow paths; production sitemap URLs for eteleorman.ro.
   - Removed privacy URLs from main sitemap while keeping Disallow.

8. **Validation / docs**
   - Added `seo:*` commands, JSON reports under `reports/`, GSC setup docs, indexing checklist.
   - Optional `seo:improve` and `seo:publish-check` (targeted; no mass rewrite).

## Changed files (summary)

### Core crawlability
- `lib/articleRoutes.js` — canonical `/post/` + `/recomandare/` only
- `lib/postHref.js` — trailing-slash hrefs
- `lib/relatedArticles.js` — related-article ranking
- `lib/rss.js` — absolute trailing-slash item URLs + author
- `src/pages/news-sitemap.xml.js` — Google News sitemap (new)
- `src/pages/sitemap.xml.js` — drop privacy URLs; keep `/stiri/` archive
- `public/robots.txt` — trailing-slash Disallows; real domain sitemaps
- `scripts/generate-search-index.js` — `/post/` URLs
- `next-sitemap.config.js` — stop using deploy-time `lastmod` for static paths

### Article UX / metadata
- `src/pages/post/[slug].js` — NewsArticle + BreadcrumbList, related block
- `src/pages/recomandare/[slug].js` — publisher from publication config
- `src/pages/categorie/[slug].js` — hard 404 + pagination
- `src/pages/autor/[slug].js` — hard 404 when empty
- `src/components/elements/HeadMeta.jsx` — RSS alternate; `@graph` JSON-LD
- `src/pages/_document.js` — RSS autodiscovery
- `src/components/common/Breadcrumb.jsx` — trailing slash
- `src/components/post/PostSectionSix.jsx` — CTA to `/stiri/`

### Tooling & docs
- `scripts/seo/*.js`, `scripts/seo-*.js`, `scripts/gsc/sitemaps.js`
- `package.json` — `seo:*` / `gsc:*` scripts; RSS in prebuild
- `SEO_AUDIT_BEFORE.md`, `SEO_CHANGES_IMPLEMENTED.md`, `SEO_REMAINING_ISSUES.md`
- `INDEXING_CHECKLIST.md`, `GSC_SETUP.md`, `.env.example`
- `reports/seo-*.json` — machine-readable audit output
- `.gitignore` — env secrets + `out/`

### Regenerated artifacts (build)
- `lib/postsRawContent.js`, `public/rss.xml`, `public/feed.rss`, `public/search-index.json`


- **Articles:** `https://eteleorman.ro/post/{slug}/`
- **Promo:** `https://eteleorman.ro/recomandare/{slug}/`
- **Categories:** `https://eteleorman.ro/categorie/{category-slug}/`
- Trailing slash required (`next.config.js`).
- Existing published `/post/` URLs preserved (no mass migration to `/categorie/slug-articol` article detail URLs).

## Commands

```bash
npm run seo:validate
npm run seo:audit
npm run seo:articles
npm run seo:links
npm run seo:sitemaps
npm run seo:images
npm run seo:duplicates
npm run seo:orphans
npm run seo:publish-check -- --slug=SOME-SLUG
npm run seo:improve -- --slug=SOME-SLUG
npm run build
```

## Deployment notes

1. Deploy from this branch via existing Cloudflare OpenNext flow (`npm run cf:build` / `cf:deploy`).
2. After deploy, verify sitemap locs use `/post/`.
3. Re-submit sitemap index in GSC (see `GSC_SETUP.md`).
4. Expect temporary GSC 404 reports for previously submitted `/stiri/{slug}/` URLs until they drop.

## Rollback

```bash
git checkout main
# or revert the SEO branch merge commit
```

Critical runtime files to watch if rolling back partially: `lib/articleRoutes.js`, sitemap pages, `src/pages/post/[slug].js`, `public/robots.txt`.
