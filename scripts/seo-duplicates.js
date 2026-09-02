#!/usr/bin/env node
/**
 * Duplicate / near-duplicate article detection (titles + body prefixes).
 * npm run seo:duplicates
 */
const { loadAllArticles, normalizeText, writeReport, severityCount } = require('./seo/lib');

function shingleFingerprint(text, size = 5) {
	const words = normalizeText(text).split(/\s+/).filter(Boolean);
	if (words.length < size) return new Set([words.join(' ')]);
	const set = new Set();
	for (let i = 0; i <= Math.min(words.length, 400) - size; i += 1) {
		set.add(words.slice(i, i + size).join(' '));
	}
	return set;
}

function jaccard(a, b) {
	if (!a.size || !b.size) return 0;
	let inter = 0;
	for (const x of a) if (b.has(x)) inter += 1;
	const union = a.size + b.size - inter;
	return union ? inter / union : 0;
}

function main() {
	const articles = loadAllArticles({ includeBody: true });
	const issues = [];
	const titleMap = new Map();

	for (const a of articles) {
		const key = normalizeText(a.title);
		if (!key) continue;
		if (!titleMap.has(key)) titleMap.set(key, []);
		titleMap.get(key).push(a.slug);
	}
	for (const [title, slugs] of titleMap) {
		if (slugs.length > 1) {
			issues.push({ severity: 'high', code: 'duplicate_title', title, slugs });
		}
	}

	// Compare recent / same-category pairs only to keep runtime reasonable
	const byCate = new Map();
	for (const a of articles) {
		const key = normalizeText(a.cate) || 'none';
		if (!byCate.has(key)) byCate.set(key, []);
		byCate.get(key).push(a);
	}

	const nearDupes = [];
	for (const group of byCate.values()) {
		const sorted = group
			.slice()
			.sort((a, b) => new Date(b.date) - new Date(a.date))
			.slice(0, 120);
		const fps = sorted.map((a) => ({
			slug: a.slug,
			fp: shingleFingerprint(a.bodyPlain || a.excerpt || a.title),
		}));
		for (let i = 0; i < fps.length; i += 1) {
			for (let j = i + 1; j < fps.length; j += 1) {
				const score = jaccard(fps[i].fp, fps[j].fp);
				if (score >= 0.72) {
					nearDupes.push({ a: fps[i].slug, b: fps[j].slug, score: Number(score.toFixed(3)) });
					issues.push({
						severity: 'medium',
						code: 'near_duplicate_body',
						slugs: [fps[i].slug, fps[j].slug],
						score: Number(score.toFixed(3)),
					});
				}
			}
		}
	}

	const report = {
		generatedAt: new Date().toISOString(),
		articleCount: articles.length,
		nearDuplicatePairs: nearDupes.length,
		nearDuplicates: nearDupes.slice(0, 300),
		summary: severityCount(issues),
		issues: issues.slice(0, 1000),
		note: 'Report only — do not auto-delete or merge without editorial review.',
	};
	const out = writeReport('seo-duplicates.json', report);
	console.log(`seo:duplicates → ${nearDupes.length} near-dupe pairs, ${issues.length} issues → ${out}`);
}

main();
