#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const outDir = path.join(ROOT, 'reports');
fs.mkdirSync(outDir, { recursive: true });

const dirs = {
	news: 'posts',
	guide: 'content/guides',
	place: 'content/places',
	institution: 'content/institutions',
	person: 'content/people',
	organization: 'content/organizations',
	event: 'content/events',
	service: 'content/services',
	explainer: 'content/explainers',
};

const byType = {};
let publishedEvergreen = 0;
let draftEvergreen = 0;
const weakTags = {};
const emptyCats = [];

for (const [type, dir] of Object.entries(dirs)) {
	const abs = path.join(ROOT, dir);
	byType[type] = 0;
	if (!fs.existsSync(abs)) continue;
	const files = fs.readdirSync(abs).filter((f) => f.endsWith('.md'));
	byType[type] = files.length;
	if (type === 'news') continue;
	for (const f of files) {
		const { data } = matter(fs.readFileSync(path.join(abs, f), 'utf8'));
		if (data.status === 'published') publishedEvergreen += 1;
		else draftEvergreen += 1;
		for (const tag of data.tags || []) {
			weakTags[tag] = (weakTags[tag] || 0) + 1;
		}
	}
}

const report = {
	generatedAt: new Date().toISOString(),
	totalNewsMarkdown: byType.news,
	byType,
	publishedEvergreen,
	draftEvergreen,
	indexableNote: 'Doar status=published + mediul production sunt indexabile',
	weakTags: Object.entries(weakTags)
		.filter(([, n]) => n < 5)
		.map(([tag, count]) => ({ tag, count })),
	emptyCats,
	actions: [
		'Completați publication.js cu date reale de contact și coordonate verificate',
		'Publicați ghiduri/entități doar după verificare editorială',
		'Adăugați URL-urile noi în Google Search Console după deploy',
	],
};

fs.writeFileSync(path.join(outDir, 'seo-editorial-report.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
