#!/usr/bin/env node
/**
 * Metadata audit for Markdown articles.
 * npm run seo:articles
 */
const { loadAllArticles, loadPublication, parseDate, writeReport, severityCount } = require('./seo/lib');

function main() {
	const pub = loadPublication();
	const articles = loadAllArticles();
	const issues = [];
	const titles = new Map();
	const descriptions = new Map();
	const paths = new Map();

	for (const a of articles) {
		const title = (a.title || '').trim();
		const desc = (a.excerpt || '').trim();

		if (!title) {
			issues.push({ severity: 'critical', code: 'missing_title', slug: a.slug, file: a.file });
		} else {
			if (title.length < 20) {
				issues.push({ severity: 'medium', code: 'short_title', slug: a.slug, title, file: a.file });
			}
			const key = title.toLowerCase();
			if (!titles.has(key)) titles.set(key, []);
			titles.get(key).push(a.slug);
		}

		if (!desc) {
			issues.push({ severity: 'high', code: 'missing_description', slug: a.slug, file: a.file });
		} else {
			const dkey = desc.toLowerCase();
			if (!descriptions.has(dkey)) descriptions.set(dkey, []);
			descriptions.get(dkey).push(a.slug);
		}

		if (!a.path) {
			issues.push({ severity: 'critical', code: 'missing_canonical_path', slug: a.slug, file: a.file });
		} else {
			if (!paths.has(a.path)) paths.set(a.path, []);
			paths.get(a.path).push(a.slug);
		}

		if (!a.featureImg) {
			issues.push({ severity: 'medium', code: 'missing_image', slug: a.slug, file: a.file });
		}

		const published = parseDate(a.date);
		if (!published) {
			issues.push({ severity: 'high', code: 'invalid_date', slug: a.slug, date: a.date, file: a.file });
		} else if (published.getTime() > Date.now() + 48 * 60 * 60 * 1000) {
			issues.push({
				severity: 'medium',
				code: 'future_publication_date',
				slug: a.slug,
				date: a.date,
				file: a.file,
			});
		}

		if (!a.author_name) {
			issues.push({ severity: 'medium', code: 'missing_author', slug: a.slug, file: a.file });
		}

		if (a.noindex) {
			issues.push({ severity: 'low', code: 'marked_noindex', slug: a.slug, file: a.file });
		}

		if (a.wordCount < 40) {
			issues.push({ severity: 'high', code: 'thin_content', slug: a.slug, wordCount: a.wordCount, file: a.file });
		} else if (a.wordCount < 120) {
			issues.push({ severity: 'medium', code: 'short_content', slug: a.slug, wordCount: a.wordCount, file: a.file });
		}
	}

	for (const [title, slugs] of titles) {
		if (slugs.length > 1) {
			issues.push({ severity: 'high', code: 'duplicate_title', title, slugs });
		}
	}
	for (const [description, slugs] of descriptions) {
		if (slugs.length > 1 && description.length > 40) {
			issues.push({ severity: 'high', code: 'duplicate_description', description: description.slice(0, 120), slugs });
		}
	}
	for (const [canonical, slugs] of paths) {
		if (slugs.length > 1) {
			issues.push({ severity: 'critical', code: 'duplicate_canonical', canonical, slugs });
		}
	}

	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		articleCount: articles.length,
		summary: severityCount(issues),
		issues,
	};
	const out = writeReport('seo-articles.json', report);
	console.log(`seo:articles → ${articles.length} articles, ${issues.length} issues → ${out}`);
	if (issues.some((i) => i.severity === 'critical')) process.exitCode = 1;
}

main();
