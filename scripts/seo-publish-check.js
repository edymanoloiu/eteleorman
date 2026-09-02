#!/usr/bin/env node
/**
 * Post-publication checks for a new/changed Markdown article.
 * Critical failures exit 1; warnings are reported separately.
 *
 * Usage: npm run seo:publish-check -- --slug=my-slug
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const {
	POSTS_DIR,
	loadAllArticles,
	loadPublication,
	parseDate,
	writeReport,
	articlePath,
} = require('./seo/lib');

function parseArgs(argv) {
	const out = { slug: null };
	for (const arg of argv) {
		if (arg.startsWith('--slug=')) out.slug = arg.slice('--slug='.length);
	}
	return out;
}

function main() {
	const { slug } = parseArgs(process.argv.slice(2));
	if (!slug) {
		console.error('Usage: npm run seo:publish-check -- --slug=article-slug');
		process.exit(1);
	}

	const pub = loadPublication();
	const file = path.join(POSTS_DIR, `${slug}.md`);
	const critical = [];
	const warnings = [];

	if (!fs.existsSync(file)) {
		critical.push('Article file missing');
		const report = { slug, critical, warnings, pass: false };
		writeReport(`seo-publish-${slug}.json`, report);
		process.exit(1);
	}

	const { data, content } = matter(fs.readFileSync(file, 'utf8'));
	const all = loadAllArticles();
	const pathForSlug = articlePath(data, slug);

	if (!data.title) critical.push('Missing title');
	if (!data.date || !parseDate(data.date)) critical.push('Invalid or missing publication date');
	if (data.noindex === true) critical.push('Article marked noindex');
	if (!content || content.trim().length < 40) critical.push('Article body missing or nearly empty');

	const titleDupes = all.filter((a) => a.slug !== slug && a.title === data.title);
	if (titleDupes.length) critical.push(`Duplicate title shared with: ${titleDupes.map((a) => a.slug).join(', ')}`);

	const pathDupes = all.filter((a) => a.slug !== slug && a.path === pathForSlug);
	if (pathDupes.length) critical.push('Canonical path collision');

	if (!data.excerpt) warnings.push('Missing excerpt/description');
	if (!data.featureImg && !data.thumb) warnings.push('Missing featured image');
	if (!data.author_name) warnings.push('Missing author');
	if (!data.cate) warnings.push('Missing category');

	const future = parseDate(data.date);
	if (future && future.getTime() > Date.now() + 48 * 60 * 60 * 1000) {
		warnings.push('Publication date is more than 48h in the future');
	}

	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		slug,
		canonicalPath: pathForSlug,
		canonicalUrl: `${pub.canonicalDomain}${pathForSlug}`,
		critical,
		warnings,
		pass: critical.length === 0,
		checklist: {
			appearsInCategory: Boolean(data.cate),
			appearsInSitemap: 'Generated dynamically from posts/ at request time',
			appearsInRss: 'Included when among newest items after generate:rss',
			structuredData: 'Emitted by src/pages/post/[slug].js for /post/ URLs',
		},
	};

	const out = writeReport(`seo-publish-${slug}.json`, report);
	console.log(JSON.stringify(report, null, 2));
	console.log(`Wrote ${out}`);
	if (!report.pass) process.exit(1);
}

main();
