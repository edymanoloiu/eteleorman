# Remaining SEO issues — eteleorman

Items not fully resolved or intentionally left for editorial/infra decisions.

## Medium

| Issue | Notes |
|-------|-------|
| Cloudflare ISR cache | `open-next.config.ts` still uses `incrementalCache: "dummy"`; `revalidate: 300` may not refresh until redeploy. Infra change required. |
| Discover image dimensions | Local audit does not measure remote Unsplash/Pexels pixel counts. Prefer ≥1200px wide / ≥300k pixels editorially. |
| Thin / templated daily content | Horoscop, vreme, curs BNR, “ce s-a întâmplat ieri” patterns may compete; use `seo:duplicates` / `seo:articles` reports — do not auto-delete. |
| Tag archives | Tags exist in frontmatter only; avoid thin auto-generated tag pages unless curated. |
| Homepage external RSS TTFB | Homepage may still SSR-fetch partner feeds; performance risk unrelated to article HTML. |
| Category query pagination | Uses `?page=`; crawlable via rel next/prev. Path-based `/page/N/` could be added later. |
| `dateModified` | Only differs when frontmatter `dateModified` is set; most posts still equal `date`. |
| Author pages | Real author bio from posts exists; still thin if only one author profile across thousands of posts. |

## Low

| Issue | Notes |
|-------|-------|
| `next-sitemap` package | Still present but not required for build; SSR XML routes are source of truth. |
| Vanity `post_views` / `post_share` | Cosmetic frontmatter; ignore for SEO. |
| Keywords meta | Often category-only; low value. |
| Evergreen content volume | Local knowledge hubs may still be sparse — separate from news crawl fixes. |

## Out of scope / not claimed

- Guaranteed indexing or ranking improvements
- Guaranteed Google News or Discover traffic
- Mass article rewriting
- Indexing API bulk submission
- Retired sitemap ping

## Suggested next editorial actions

1. Triage `reports/seo-articles.json` critical/high issues.
2. Improve or consolidate near-duplicates flagged in `reports/seo-duplicates.json` selectively via `seo:improve`.
3. Replace heavily reused stock images where Discover eligibility matters.
4. Monitor GSC coverage for decline of legacy `/stiri/` 404s after sitemap fix.
