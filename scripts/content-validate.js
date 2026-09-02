#!/usr/bin/env node
/**
 * Validează frontmatter-ul evergreen și semnalează probleme pe posts legacy.
 * Exit code 1 dacă există erori pe conținut published.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const CONTENT_DIRS = [
	'content/guides',
	'content/places',
	'content/institutions',
	'content/people',
	'content/organizations',
	'content/events',
	'content/services',
	'content/explainers',
	'content/authors',
];

const REQUIRED = [
	'title', 'slug', 'contentType', 'status', 'description',
	'datePublished', 'dateModified', 'author', 'category', 'city', 'county',
];
const STATUSES = new Set(['draft', 'review', 'published', 'archived']);
const TYPES = new Set(['news', 'guide', 'place', 'institution', 'person', 'organization', 'event', 'service', 'explainer']);

const EN_TAG_HINTS = /^(news|guide|events?|health|education|transport|tourism|culture|sports?|environment)$/i;

let errors = 0;
let warnings = 0;
const report = { errors: [], warnings: [], published: 0, drafts: 0 };
const slugs = new Map();
const titles = new Map();

function fail(file, msg) {
	errors += 1;
	report.errors.push({ file, msg });
	console.error(`✖ ${file}: ${msg}`);
}

function warn(file, msg) {
	warnings += 1;
	report.warnings.push({ file, msg });
	console.warn(`⚠ ${file}: ${msg}`);
}

for (const dir of CONTENT_DIRS) {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) continue;
	for (const file of fs.readdirSync(abs).filter((f) => f.endsWith('.md'))) {
		const filePath = path.join(dir, file);
		const raw = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
		if (!raw.trim()) {
			fail(filePath, 'Fișier gol');
			continue;
		}
		if (/TODO|lorem ipsum|placeholder/i.test(raw)) {
			warn(filePath, 'Conține placeholder');
		}
		const { data, content } = matter(raw);
		for (const field of REQUIRED) {
			if (data[field] === undefined || data[field] === null || data[field] === '') {
				if (data.status === 'published') fail(filePath, `Câmp obligatoriu lipsă: ${field}`);
				else warn(filePath, `Câmp lipsă: ${field}`);
			}
		}
		if (data.contentType && !TYPES.has(data.contentType)) fail(filePath, `contentType invalid: ${data.contentType}`);
		if (data.status && !STATUSES.has(data.status)) fail(filePath, `status invalid: ${data.status}`);
		if (data.status === 'published') report.published += 1;
		else report.drafts += 1;

		if (data.status === 'published' && !content.trim()) fail(filePath, 'Conținut published fără corp');
		if (data.featuredImage && !data.featuredImageAlt) fail(filePath, 'featuredImageAlt lipsă');
		if (data.datePublished && Number.isNaN(Date.parse(data.datePublished))) fail(filePath, 'datePublished invalid');
		if (data.status === 'published' && data.datePublished && Date.parse(data.datePublished) > Date.now() + 60000) {
			fail(filePath, 'datePublished în viitor');
		}

		const slug = data.slug || file.replace(/\.md$/, '');
		if (slugs.has(slug)) fail(filePath, `Slug duplicat: ${slug} (și în ${slugs.get(slug)})`);
		else slugs.set(slug, filePath);

		if (data.title) {
			const t = String(data.title).toLowerCase();
			if (titles.has(t) && data.status === 'published') warn(filePath, `Titlu duplicat: ${data.title}`);
			titles.set(t, filePath);
		}

		for (const tag of data.tags || []) {
			if (EN_TAG_HINTS.test(String(tag))) warn(filePath, `Etichetă posibil în engleză: ${tag}`);
		}

		if (data.status === 'published' && (!data.sources || !data.sources.length)) {
			warn(filePath, 'Fără sources');
		}
	}
}

const outDir = path.join(ROOT, 'reports');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'content-validate.json'), JSON.stringify(report, null, 2));

console.log(`\nValidare: ${errors} erori, ${warnings} avertismente, ${report.published} publicate, ${report.drafts} nepublicate`);
if (errors > 0) process.exit(1);
