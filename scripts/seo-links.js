#!/usr/bin/env node
/**
 * Internal linking / orphan heuristics for news articles.
 * npm run seo:links | npm run seo:orphans
 */
const fs = require('fs');
const path = require('path');
const { loadAllArticles, writeReport, severityCount, ROOT, slugifyLite } = require('./seo/lib');

function extractInternalLinks(markdown) {
	const links = [];
	const re = /\]\((\/[^)\s]+)\)/g;
	let m;
	while ((m = re.exec(markdown))) {
		links.push(m[1].split('#')[0].split('?')[0]);
	}
	return links;
}

function main() {
	const mode = process.argv[2] || 'links';
	const articles = loadAllArticles({ includeBody: true });
	const bySlug = new Map(articles.map((a) => [a.slug, a]));
	const byPath = new Map(articles.map((a) => [a.path.replace(/\/$/, '') + '/', a]));
	const inbound = new Map(articles.map((a) => [a.slug, 0]));
	const issues = [];
	const broken = [];

	// Homepage / category / stiri / related engine imply discovery for all non-promo posts.
	// Count explicit MD links plus category membership as crawl paths.
	const categoryMembers = new Map();
	for (const a of articles) {
		if (a.isPromo) continue;
		const cateKey = slugifyLite(a.cate);
		if (!categoryMembers.has(cateKey)) categoryMembers.set(cateKey, []);
		categoryMembers.get(cateKey).push(a.slug);
		// Category archive + chronological listings cover the article
		inbound.set(a.slug, (inbound.get(a.slug) || 0) + 1);
	}

	for (const a of articles) {
		const body = a.rawBody || '';
		const links = extractInternalLinks(body);
		for (const href of links) {
			const normalized = href.endsWith('/') ? href : `${href}/`;
			if (normalized.startsWith('/post/') || normalized.startsWith('/recomandare/')) {
				const target = byPath.get(normalized);
				if (!target) {
					broken.push({ from: a.slug, href: normalized });
					issues.push({
						severity: 'high',
						code: 'broken_internal_link',
						from: a.slug,
						href: normalized,
					});
				} else {
					inbound.set(target.slug, (inbound.get(target.slug) || 0) + 1);
				}
			} else if (normalized.startsWith('/stiri/') && normalized !== '/stiri/') {
				// Legacy mistaken section URLs
				issues.push({
					severity: 'high',
					code: 'link_to_nonexistent_section_path',
					from: a.slug,
					href: normalized,
				});
			}
		}
	}

	const orphans = [];
	const weaklyLinked = [];
	for (const a of articles) {
		if (a.isPromo) continue;
		const count = inbound.get(a.slug) || 0;
		if (count === 0) {
			orphans.push(a.slug);
			issues.push({ severity: 'high', code: 'orphan_article', slug: a.slug, path: a.path });
		} else if (count === 1) {
			weaklyLinked.push(a.slug);
		}
	}

	const report = {
		generatedAt: new Date().toISOString(),
		mode,
		articleCount: articles.length,
		orphanCount: orphans.length,
		weaklyLinkedCount: weaklyLinked.length,
		brokenInternalLinks: broken.length,
		orphans: orphans.slice(0, 200),
		weaklyLinked: weaklyLinked.slice(0, 200),
		broken: broken.slice(0, 200),
		summary: severityCount(issues),
		issues: issues.slice(0, 1000),
	};

	const outName = mode === 'orphans' ? 'seo-orphans.json' : 'seo-links.json';
	const out = writeReport(outName, report);
	console.log(
		`seo:${mode} → orphans=${orphans.length} weak=${weaklyLinked.length} broken=${broken.length} → ${out}`
	);
	if (broken.length > 0) process.exitCode = 1;
}

main();
