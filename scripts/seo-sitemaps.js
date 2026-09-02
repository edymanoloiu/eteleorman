#!/usr/bin/env node
/**
 * Sitemap / robots structural validation (source-level).
 * npm run seo:sitemaps
 */
const fs = require('fs');
const path = require('path');
const { loadAllArticles, loadPublication, writeReport, severityCount, ROOT } = require('./seo/lib');

function main() {
	const pub = loadPublication();
	const articles = loadAllArticles();
	const issues = [];

	const robotsPath = path.join(ROOT, 'public/robots.txt');
	if (!fs.existsSync(robotsPath)) {
		issues.push({ severity: 'critical', code: 'missing_robots' });
	} else {
		const robots = fs.readFileSync(robotsPath, 'utf8');
		if (!/Sitemap:\s*https:\/\/eteleorman\.ro\/sitemap-index\.xml/i.test(robots)) {
			issues.push({ severity: 'high', code: 'robots_missing_sitemap_index' });
		}
		if (/ACTUAL-DOMAIN|example\.com|TODO/i.test(robots)) {
			issues.push({ severity: 'critical', code: 'robots_placeholder_domain' });
		}
		if (/Disallow:\s*\/post/i.test(robots)) {
			issues.push({ severity: 'critical', code: 'robots_blocks_posts' });
		}
	}

	const requiredPages = [
		'src/pages/sitemap.xml.js',
		'src/pages/sitemap-index.xml.js',
		'src/pages/sitemap-articole.xml.js',
		'src/pages/news-sitemap.xml.js',
	];
	for (const file of requiredPages) {
		if (!fs.existsSync(path.join(ROOT, file))) {
			issues.push({ severity: 'critical', code: 'missing_sitemap_route', file });
		}
	}

	const articleRoutes = fs.readFileSync(path.join(ROOT, 'lib/articleRoutes.js'), 'utf8');
	if (/Azi in Bucuresti|transport-in-bucuresti|cultura-in-bucuresti/.test(articleRoutes)) {
		issues.push({ severity: 'critical', code: 'article_routes_bucuresti_leftovers' });
	}
	if (!/return 'post'/.test(articleRoutes) && !/getArticlePathPrefix[\s\S]*'post'/.test(articleRoutes)) {
		issues.push({ severity: 'high', code: 'article_routes_may_not_use_post' });
	}

	const sitemapXml = fs.readFileSync(path.join(ROOT, 'src/pages/sitemap.xml.js'), 'utf8');
	if (!/getArticleUrlPath/.test(sitemapXml)) {
		issues.push({ severity: 'high', code: 'sitemap_missing_article_helper' });
	}

	const paths = new Set();
	let dupes = 0;
	for (const a of articles) {
		if (paths.has(a.path)) {
			dupes += 1;
			issues.push({ severity: 'critical', code: 'duplicate_article_path', path: a.path, slug: a.slug });
		}
		paths.add(a.path);
		if (!a.path.startsWith('/post/') && !a.path.startsWith('/recomandare/')) {
			issues.push({ severity: 'critical', code: 'unexpected_article_path', path: a.path, slug: a.slug });
		}
	}

	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		articleCount: articles.length,
		uniquePaths: paths.size,
		duplicatePaths: dupes,
		summary: severityCount(issues),
		issues,
	};
	const out = writeReport('seo-sitemaps.json', report);
	console.log(`seo:sitemaps → ${issues.length} issues → ${out}`);
	if (issues.some((i) => i.severity === 'critical' || i.severity === 'high')) process.exitCode = 1;
}

main();
