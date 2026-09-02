#!/usr/bin/env node
/**
 * Aggregate SEO audit (source-level).
 * npm run seo:audit
 */
const { spawnSync } = require('child_process');
const path = require('path');
const { writeReport, loadPublication, loadAllArticles, ROOT } = require('./seo/lib');

const STEPS = [
	['seo:sitemaps', 'scripts/seo-sitemaps.js'],
	['seo:articles', 'scripts/seo-articles.js'],
	['seo:images', 'scripts/seo-images.js'],
	['seo:links', 'scripts/seo-links.js'],
	['seo:duplicates', 'scripts/seo-duplicates.js'],
];

function run(label, script) {
	const result = spawnSync(process.execPath, [path.join(ROOT, script)], {
		stdio: 'inherit',
		env: process.env,
	});
	return { label, code: result.status == null ? 1 : result.status };
}

function main() {
	const pub = loadPublication();
	const articles = loadAllArticles();
	const results = STEPS.map(([label, script]) => run(label, script));
	const failed = results.filter((r) => r.code !== 0);

	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		articleCount: articles.length,
		steps: results,
		failed: failed.map((f) => f.label),
		layers: {
			crawling: 'Improved when sitemaps use /post/ URLs; validate in seo-sitemaps.json',
			rendering: 'Article HTML is server-rendered via getStaticProps + markdownToHtml',
			discovery: 'Homepage, categories, RSS, sitemaps, related articles',
			indexing: 'Not guaranteed — submit sitemap in GSC and monitor coverage',
			ranking: 'Content quality dependent; see seo-duplicates / seo-articles',
			googleNews: 'news-sitemap.xml includes ~48h eligible articles only',
			googleDiscover: 'Image/quality reports only; eligibility not guaranteed',
		},
	};
	const out = writeReport('seo-audit.json', report);
	console.log(`seo:audit → ${out}`);
	if (failed.length) process.exitCode = 1;
}

main();
