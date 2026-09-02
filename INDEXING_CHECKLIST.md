# Indexing checklist — eteleorman.ro

Use after deploys. None of these steps guarantee indexing, rankings, News, or Discover.

## Crawling

- [ ] `https://eteleorman.ro/robots.txt` allows `/post/` and lists sitemap index
- [ ] `https://eteleorman.ro/sitemap-index.xml` returns 200
- [ ] Article locs use `/post/{slug}/` (or `/recomandare/{slug}/`), not `/stiri/{slug}/`
- [ ] `news-sitemap.xml` returns 200 and only recent eligible news
- [ ] No accidental `noindex` / `X-Robots-Tag: noindex` on public articles
- [ ] CSS/JS required for layout are not blocked in robots.txt

## Rendering

- [ ] View article source (disable JS): full article text present in HTML
- [ ] Missing slug returns real HTTP 404 (not soft 404)
- [ ] Empty category/author returns 404

## Discovery

- [ ] New article appears on category page `/categorie/{category}/`
- [ ] New article appears in `/stiri/` or homepage recent modules (design permitting)
- [ ] New article appears in `/rss.xml` when among newest items
- [ ] New article appears in XML sitemaps after deploy/request
- [ ] Related articles block shows topical links (not only global newest)
- [ ] Breadcrumb links are real `<a href>`

## Metadata

- [ ] Unique `<title>` and meta description from frontmatter/content
- [ ] Absolute canonical matches live URL
- [ ] `og:type=article`, OG image absolute HTTPS URL
- [ ] `robots` includes `max-image-preview:large` on indexable pages
- [ ] JSON-LD parses; `mainEntityOfPage` matches canonical

## Indexing (GSC)

- [ ] Sitemap submitted (see `GSC_SETUP.md`)
- [ ] Sample URL Inspection on 2–3 new articles (manual, low volume)
- [ ] Monitor coverage for leftover `/stiri/` 404s declining over time

## News / Discover eligibility (not guarantees)

- [ ] News sitemap limited to recent genuine news
- [ ] Featured images relevant; prefer ≥1200px wide / ≥300k pixels when possible
- [ ] No misleading dates or fake freshness

## Commands

```bash
npm run seo:validate
npm run seo:audit
npm run seo:publish-check -- --slug=YOUR-SLUG
```
