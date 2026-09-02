import fs from 'fs';
import path from 'path';
import { normalizeDiacritics } from './slugify.js';
import { getPublicHref } from './contentTypes.js';
import { loadPublishedEvergreen } from './contentLoader.js';
import { getArticleUrlPath } from '../articleRoutes.js';
import publication from '../../src/data/publication.js';

/**
 * Index de căutare generat la build. Nu produce pagini indexabile per query.
 */
export function buildSearchIndex({ newsPosts = [] } = {}) {
	const evergreen = loadPublishedEvergreen();
	const entries = [];

	for (const post of newsPosts) {
		if (!post?.slug) continue;
		entries.push({
			title: post.title,
			description: post.excerpt || '',
			contentType: 'news',
			city: publication.city,
			county: publication.county,
			category: post.cate,
			tags: post.tags || [],
			entities: post.entities || [],
			date: post.date,
			slug: post.slug,
			url: `/${getArticleUrlPath(post)}/`,
			_search: normalizeDiacritics(
				[post.title, post.excerpt, post.cate, ...(post.tags || [])].filter(Boolean).join(' ')
			),
		});
	}

	for (const doc of evergreen) {
		entries.push({
			title: doc.title,
			description: doc.description || '',
			contentType: doc.contentType,
			city: doc.city || publication.city,
			county: doc.county || publication.county,
			category: doc.category,
			tags: doc.tags || [],
			entities: doc.entities || [],
			date: doc.datePublished,
			slug: doc.slug,
			url: getPublicHref(doc),
			_search: normalizeDiacritics(
				[doc.title, doc.description, doc.category, ...(doc.tags || []), ...(doc.entities || [])]
					.filter(Boolean)
					.join(' ')
			),
		});
	}

	return entries;
}

export function searchIndex(entries, query, { contentType = null, limit = 20 } = {}) {
	const q = normalizeDiacritics(query || '').trim();
	if (!q) return [];
	const tokens = q.split(/\s+/).filter(Boolean);

	const scored = [];
	for (const entry of entries) {
		if (contentType && entry.contentType !== contentType) continue;
		let score = 0;
		const hay = entry._search || '';
		for (const token of tokens) {
			if (hay.includes(token)) score += 2;
			if (normalizeDiacritics(entry.title).includes(token)) score += 3;
			if (entry.contentType !== 'news') score += 1; // prioritizează entitățile/ghidurile
		}
		if (score > 0) scored.push({ ...entry, score });
	}

	return scored.sort((a, b) => b.score - a.score).slice(0, limit);
}

export function writeSearchIndex(entries, outPath = 'public/search-index.json') {
	const abs = path.join(process.cwd(), outPath);
	fs.mkdirSync(path.dirname(abs), { recursive: true });
	const publicEntries = entries.map(({ _search, ...rest }) => ({ ...rest, _search }));
	fs.writeFileSync(abs, JSON.stringify(publicEntries));
	return abs;
}

export default buildSearchIndex;
