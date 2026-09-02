#!/usr/bin/env node
/**
 * Full validation gate for critical SEO invariants.
 * npm run seo:validate
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const {
	loadAllArticles,
	loadPublication,
	writeReport,
	severityCount,
	ROOT,
} = require('./seo/lib');

function main() {
	const pub = loadPublication();
	const articles = loadAllArticles();
	const issues = [];

	if (!pub.canonicalDomain.startsWith('https://')) {
		issues.push({ severity: 'critical', code: 'canonical_not_https', domain: pub.canonicalDomain });
	}

	const required = [
		'lib/articleRoutes.js',
		'lib/postHref.js',
		'lib/relatedArticles.js',
		'src/pages/news-sitemap.xml.js',
		'src/pages/post/[slug].js',
		'public/robots.txt',
		'SEO_AUDIT_BEFORE.md',
	];
	for (const file of required) {
		if (!fs.existsSync(path.join(ROOT, file))) {
			issues.push({ severity: 'critical', code: 'missing_required_file', file });
		}
	}

	const routes = fs.readFileSync(path.join(ROOT, 'lib/articleRoutes.js'), 'utf8');
	if (/bucuresti/i.test(routes)) {
		issues.push({ severity: 'critical', code: 'bucuresti_routes_present' });
	}

	const paths = new Set();
	for (const a of articles) {
		if (!a.slug) issues.push({ severity: 'critical', code: 'missing_slug', file: a.file });
		if (!a.title) issues.push({ severity: 'critical', code: 'missing_title', slug: a.slug });
		if (paths.has(a.path)) {
			issues.push({ severity: 'critical', code: 'duplicate_path', path: a.path, slug: a.slug });
		}
		paths.add(a.path);
		if (!/^\/(post|recomandare)\/[a-z0-9-]+\/$/i.test(a.path)) {
			issues.push({ severity: 'critical', code: 'invalid_public_path', path: a.path, slug: a.slug });
		}
	}

	// Nested checks (non-fatal for medium issues)
	const nested = ['scripts/seo-sitemaps.js', 'scripts/seo-articles.js'];
	const nestedResults = [];
	for (const script of nested) {
		const result = spawnSync(process.execPath, [path.join(ROOT, script)], {
			encoding: 'utf8',
			env: process.env,
		});
		nestedResults.push({ script, code: result.status });
		if (result.status !== 0) {
			issues.push({ severity: 'high', code: 'nested_check_failed', script, status: result.status });
		}
	}

	const critical = issues.filter((i) => i.severity === 'critical');
	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		articleCount: articles.length,
		uniquePaths: paths.size,
		nestedResults,
		summary: severityCount(issues),
		issues,
		pass: critical.length === 0,
	};
	const out = writeReport('seo-validate.json', report);
	console.log(`seo:validate → pass=${report.pass} issues=${issues.length} → ${out}`);
	if (!report.pass) process.exitCode = 1;
}

main();
