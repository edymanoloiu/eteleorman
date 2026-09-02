#!/usr/bin/env node
/**
 * Shared helpers for SEO audit scripts.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const POSTS_DIR = path.join(ROOT, 'posts');
const REPORTS_DIR = path.join(ROOT, 'reports');

const DIACRITICS = {
	ă: 'a', â: 'a', î: 'i', ș: 's', ț: 't', ş: 's',
	Ă: 'a', Â: 'a', Î: 'i', Ș: 's', Ț: 't', Ş: 's',
};

function ensureReportsDir() {
	fs.mkdirSync(REPORTS_DIR, { recursive: true });
	return REPORTS_DIR;
}

function writeReport(name, data) {
	ensureReportsDir();
	const file = path.join(REPORTS_DIR, name);
	fs.writeFileSync(file, JSON.stringify(data, null, 2));
	return file;
}

function loadPublication() {
	const t = fs.readFileSync(path.join(ROOT, 'src/data/publication.js'), 'utf8');
	const pick = (key) => (t.match(new RegExp(`${key}:\\s*['"]([^'"]+)`)) || [])[1];
	return {
		canonicalDomain: (pick('canonicalDomain') || 'https://aziinresita.ro').replace(/\/$/, ''),
		publicationName: pick('publicationName') || 'AziInReșița',
		city: pick('city') || 'Reșița',
		categorySlug: pick('categorySlug') || 'azi-in-resita',
		logo: pick('logo') || '/images/logo.png',
	};
}

function normalizeText(value) {
	return String(value || '')
		.split('')
		.map((c) => DIACRITICS[c] || c)
		.join('')
		.toLowerCase()
		.replace(/<[^>]+>/g, ' ')
		.replace(/[^a-z0-9\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

function slugifyLite(text) {
	return normalizeText(text).replace(/\s+/g, '-').replace(/-+/g, '-');
}

function isRecomandare(data) {
	const tags = Array.isArray(data.tags) ? data.tags : data.tags ? [data.tags] : [];
	return tags.some((t) => ['recomandare', 'recomandare partener'].includes(String(t).toLowerCase()));
}

function articlePath(data, slug) {
	return isRecomandare(data) ? `/recomandare/${slug}/` : `/post/${slug}/`;
}

function parseDate(value) {
	if (!value) return null;
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d;
}

function loadAllArticles({ includeBody = false } = {}) {
	if (!fs.existsSync(POSTS_DIR)) return [];
	const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.md'));
	const articles = [];
	for (const file of files) {
		const slug = file.replace(/\.md$/, '');
		const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
		const { data, content } = matter(raw);
		const body = content || '';
		const plain = normalizeText(body);
		articles.push({
			file,
			slug,
			path: articlePath(data, slug),
			title: data.title || '',
			excerpt: data.excerpt || '',
			date: data.date,
			dateModified: data.dateModified || null,
			cate: data.cate || '',
			tags: data.tags || [],
			author_name: data.author_name || '',
			featureImg: data.featureImg || data.thumb || '',
			isPromo: isRecomandare(data),
			noindex: data.noindex === true || data.robots === 'noindex',
			wordCount: plain ? plain.split(/\s+/).filter(Boolean).length : 0,
			bodyHash: includeBody ? plain.slice(0, 800) : undefined,
			bodyPlain: includeBody ? plain : undefined,
			rawBody: includeBody ? body : undefined,
			frontmatter: data,
		});
	}
	return articles;
}

function severityCount(issues) {
	return issues.reduce(
		(acc, i) => {
			acc[i.severity] = (acc[i.severity] || 0) + 1;
			acc.total += 1;
			return acc;
		},
		{ critical: 0, high: 0, medium: 0, low: 0, total: 0 }
	);
}

module.exports = {
	ROOT,
	POSTS_DIR,
	REPORTS_DIR,
	ensureReportsDir,
	writeReport,
	loadPublication,
	normalizeText,
	slugifyLite,
	isRecomandare,
	articlePath,
	parseDate,
	loadAllArticles,
	severityCount,
};
