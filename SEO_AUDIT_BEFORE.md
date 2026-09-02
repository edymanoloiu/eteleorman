# SEO Audit — eteleorman (before changes)

**Date:** 2026-07-31  
**Branch base:** `main`  
**Domain:** https://eteleorman.ro  
**Stack:** Next.js ^16.2.4, React ^19.2.0, **Pages Router**, Markdown in `posts/` (~3904 files), Cloudflare via OpenNext (`wrangler.jsonc`)

This audit describes crawlability, rendering, discovery, and indexability. It does **not** guarantee indexing, rankings, Google News, or Discover traffic.

---

## Architecture summary

| Area | Finding |
|------|---------|
| Router | Pages Router (`src/pages/`) |
| Articles | `posts/*.md` → `lib/postsRawContent.js` (prebuild) → `lib/api.js` |
| Live article URL | **`/post/{slug}/`** (promo: `/recomandare/{slug}/`) |
| Preferred vs live | Spec prefers `/categorie/slug-articol`; **live published URLs are `/post/{slug}/`** — preserve them |
| Rendering | Articles: ISR (`fallback: 'blocking'`, `revalidate: 300`); many hubs: SSR |
| Trailing slash | `trailingSlash: true` |
| Images | `images.unoptimized: true` |
| SEO libs | `next-sitemap` present but **not wired into build**; custom SSR XML sitemaps |

---

## Issues

### 1. Sitemaps emit non-existent article URLs — **critical**

- **Files:** `lib/articleRoutes.js`, `src/pages/sitemap.xml.js`, `src/pages/sitemap-articole.xml.js`, hub pages importing `articleRoutes`, `lib/local-knowledge/contentGraph.js`, `lib/local-knowledge/searchIndex.js`, `scripts/generate-search-index.js`
- **Why:** ~3500+ locs use `/stiri|cultura|evenimente/{slug}/` from Bucharest-forked `articleRoutes.js`. Those detail routes **do not exist** → 404s, wasted crawl budget, delayed discovery of real `/post/` URLs.
- **Proposed fix:** Align `getArticleUrlPath` / `getPostHref` with live `/post/` and `/recomandare/` paths. Do not mass-migrate URLs.
- **Safe to automate:** Yes

### 2. `news-sitemap.xml` advertised but missing — **critical**

- **Files:** `public/robots.txt`, `src/pages/sitemap-index.xml.js`
- **Why:** Broken sitemap references in robots and sitemap index confuse Search Console / News discovery.
- **Proposed fix:** Implement Google News sitemap for recent eligible articles, or remove references.
- **Safe to automate:** Yes (site publishes genuine local news)

### 3. Search index URLs wrong — **critical**

- **Files:** `scripts/generate-search-index.js` (hardcodes `/stiri/`), `lib/local-knowledge/searchIndex.js`
- **Why:** Internal search and related graph links lead to 404.
- **Proposed fix:** Use canonical `/post/{slug}/` helpers.
- **Safe to automate:** Yes

### 4. Dual `getPostHref` implementations — **high**

- **Files:** `lib/postHref.js` (correct) vs `lib/articleRoutes.js` (wrong section paths)
- **Why:** Homepage cards use correct links; topic hubs/sitemaps use broken ones → inconsistent crawl paths.
- **Proposed fix:** Single source of truth; `articleRoutes` delegates to post paths.
- **Safe to automate:** Yes

### 5. Soft 404 on empty category/author — **high**

- **Files:** `src/pages/categorie/[slug].js`, `src/pages/autor/[slug].js`
- **Why:** Empty archives return HTTP 200 with broken/empty UI → soft 404 risk.
- **Proposed fix:** `notFound: true` when no matching posts.
- **Safe to automate:** Yes

### 6. No RSS feed autodiscovery — **high**

- **Files:** `src/pages/_document.js`, `src/components/elements/HeadMeta.jsx`
- **Why:** Feeds exist (`public/rss.xml`, `feed.rss`) but crawlers/readers may not find them from HTML.
- **Proposed fix:** `<link rel="alternate" type="application/rss+xml">` in document head.
- **Safe to automate:** Yes

### 7. RSS item URLs omit trailing slash / OpenNext asset risk — **high**

- **Files:** `lib/rss.js`, `scripts/postbuild.cjs`, `package.json` (`postbuild` after build)
- **Why:** Site requires trailing slash; RSS may miss OpenNext asset pipeline if generated only after bundle.
- **Proposed fix:** Trailing-slash item URLs; generate RSS in prebuild and keep postbuild copy.
- **Safe to automate:** Yes

### 8. Related block is “newest posts”, not topical — **medium**

- **Files:** `src/pages/post/[slug].js`, `src/components/post/PostSectionSix.jsx`
- **Why:** Links every article to the same newest set; button points at `/categorie/stiri-generale` which may not match real categories (`Azi in Alexandria`).
- **Proposed fix:** Deterministic related engine (category, tags, date); fix CTA to real category slug.
- **Safe to automate:** Yes

### 9. JSON-LD gaps — **medium**

- **Files:** `src/pages/post/[slug].js`
- **Why:** Always `Article`; `dateModified === datePublished`; no `BreadcrumbList`; publisher label is domain string, not organization name from `publication.js`.
- **Proposed fix:** `NewsArticle` for editorial news; truthful dates; BreadcrumbList; publisher from publication config.
- **Safe to automate:** Yes (without inventing authors/dates)

### 10. Category pages dump all posts (no pagination) — **medium**

- **Files:** `src/pages/categorie/[slug].js`, `src/pages/stiri.js`, `src/pages/autor/[slug].js`
- **Why:** Very large HTML responses; weaker crawl efficiency; no stable page-2+ crawl path.
- **Proposed fix:** Server-rendered pagination with crawlable links.
- **Safe to automate:** Yes

### 11. `articleRoutes.js` Bucharest leftovers — **medium**

- **Files:** `lib/articleRoutes.js` (`Azi in Bucuresti`, Bucuresti slug heuristics)
- **Why:** Wrong category constants for Alexandria; feeds incorrect section mapping.
- **Proposed fix:** Alexandria-aware or retire section routing in favor of `/post/`.
- **Safe to automate:** Yes

### 12. Shallow SEO validation — **medium**

- **Files:** `scripts/seo-check.js`, `scripts/content-validate.js` (evergreen only)
- **Why:** Does not catch sitemap/URL parity, metadata, orphans, duplicates, images.
- **Proposed fix:** Full `seo:*` command suite + JSON reports.
- **Safe to automate:** Yes

### 13. ISR effectively disabled on Cloudflare — **medium**

- **Files:** `open-next.config.ts` (`incrementalCache: "dummy"`)
- **Why:** `revalidate: 300` may not refresh articles until full redeploy → slower freshness for crawlers.
- **Proposed fix:** Document; enable real cache when infra allows. Do not silently change hosting without review.
- **Safe to automate:** Partially (infra decision)

### 14. Privacy URLs in sitemap while robots Disallow — **low**

- **Files:** `src/pages/sitemap.xml.js`, `public/robots.txt`
- **Why:** Mixed signals for `/gdpr/`, `/cookies/`.
- **Proposed fix:** Remove from sitemap (keep Disallow).
- **Safe to automate:** Yes

### 15. Breadcrumb category links omit trailing slash — **low**

- **Files:** `src/components/common/Breadcrumb.jsx`
- **Why:** Minor redirect/consistency risk with `trailingSlash: true`.
- **Proposed fix:** Add trailing slash.
- **Safe to automate:** Yes

### 16. No dedicated tag archives — **low**

- **Why:** Tags exist in frontmatter only; not required if categories + homepage cover discovery.
- **Proposed fix:** Optional later; avoid thin empty tag pages.
- **Safe to automate:** No (product decision)

### 17. Featured image quality for Discover — **medium** (content-level)

- **Why:** Mix of local webp and Unsplash; dimensions not validated at build.
- **Proposed fix:** Image audit script; report only; do not upscale.
- **Safe to automate:** Audit yes; content fixes optional

### 18. Thin / near-duplicate daily templates — **medium** (content-level)

- **Why:** Horoscop, vreme, curs BNR, “ce s-a întâmplat ieri” patterns may dilute quality signals.
- **Proposed fix:** Content quality audit reports; optional improve command; **do not auto-delete**.
- **Safe to automate:** Report yes; rewrite optional and targeted

---

## What already works

- Real article pages at `/post/{slug}/` with SSR HTML content (markdown → HTML in `getStaticProps`)
- Hard `404` for missing article slugs
- Canonical + OG + Twitter via `HeadMeta` on articles
- `robots` directive helper supports `max-image-preview:large` when indexable
- Homepage and cards use correct `lib/postHref.js`
- Promo posts redirect `/post/` → `/recomandare/` permanently
- Publication config has real domain `https://eteleorman.ro`
- Robots allows article paths; search results `/cauta` disallowed (good crawl waste control)

---

## Distinction (for later reports)

| Layer | Status before fixes |
|-------|---------------------|
| Crawling | Impaired by sitemap 404 URLs |
| Rendering | Article body SSR OK |
| Discovery | Broken sitemap/search paths; weak related links |
| Indexing | Cannot guarantee; broken discovery hurts |
| Ranking | Out of scope for technical fixes alone |
| Google News | Missing news sitemap; eligibility not guaranteed |
| Google Discover | Needs image/quality audit; not guaranteed |
