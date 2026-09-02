import { getPublicHref, CONTENT_TYPES } from './contentTypes.js';
import { loadPublishedEvergreen } from './contentLoader.js';
import { normalizeDiacritics } from './slugify.js';
import { getArticleUrlPath } from '../articleRoutes.js';

/**
 * Construiește un graf ușor al conținutului pentru linkuri interne,
 * recomandări, breadcrumbs și detectarea orfanilor.
 */
export function buildContentGraph({ newsPosts = [], evergreenDocs = null } = {}) {
	const evergreen = evergreenDocs || loadPublishedEvergreen();
	const nodes = new Map();

	for (const post of newsPosts) {
		if (!post?.slug) continue;
		const href = `/${getArticleUrlPath(post)}/`;
		nodes.set(`news:${post.slug}`, {
			id: `news:${post.slug}`,
			contentType: 'news',
			slug: post.slug,
			title: post.title,
			href,
			category: post.cate,
			tags: post.tags || [],
			entities: post.entities || [],
			relatedSlugs: post.relatedSlugs || [],
			datePublished: post.date,
			city: post.city,
		});
	}

	for (const doc of evergreen) {
		const href = getPublicHref(doc);
		nodes.set(`${doc.contentType}:${doc.slug}`, {
			id: `${doc.contentType}:${doc.slug}`,
			contentType: doc.contentType,
			slug: doc.slug,
			title: doc.title,
			href,
			category: doc.category,
			tags: doc.tags || [],
			entities: doc.entities || [],
			relatedSlugs: doc.relatedSlugs || [],
			datePublished: doc.datePublished,
			dateModified: doc.dateModified,
			city: doc.city,
			primaryTopic: doc.primaryTopic,
		});
	}

	const edges = [];
	const inbound = new Map();

	for (const node of nodes.values()) {
		inbound.set(node.id, inbound.get(node.id) || 0);
		const related = node.relatedSlugs || [];
		for (const rel of related) {
			const target = findNodeBySlug(nodes, rel);
			if (target) {
				edges.push({ from: node.id, to: target.id, type: 'related' });
				inbound.set(target.id, (inbound.get(target.id) || 0) + 1);
			}
		}
		for (const entity of node.entities || []) {
			const target = findNodeByEntity(nodes, entity);
			if (target) {
				edges.push({ from: node.id, to: target.id, type: 'entity' });
				inbound.set(target.id, (inbound.get(target.id) || 0) + 1);
			}
		}
	}

	const orphans = [...nodes.values()].filter((n) => (inbound.get(n.id) || 0) === 0 && n.contentType !== 'news');

	return {
		nodes,
		edges,
		orphans,
		getRelated(slug, { limit = 6, contentTypes = null } = {}) {
			const self = findNodeBySlug(nodes, slug);
			if (!self) return [];
			const scored = [];
			for (const other of nodes.values()) {
				if (other.id === self.id) continue;
				if (contentTypes && !contentTypes.includes(other.contentType)) continue;
				let score = 0;
				if (self.category && other.category === self.category) score += 3;
				const tagOverlap = intersection(self.tags, other.tags).length;
				score += tagOverlap * 2;
				const entityOverlap = intersection(self.entities, other.entities).length;
				score += entityOverlap * 3;
				if (self.primaryTopic && other.primaryTopic === self.primaryTopic) score += 2;
				if (score > 0) scored.push({ ...other, score });
			}
			return scored.sort((a, b) => b.score - a.score).slice(0, limit);
		},
		getByType(contentType) {
			return [...nodes.values()].filter((n) => n.contentType === contentType);
		},
		getRecentNewsAbout(entitySlug, limit = 5) {
			return [...nodes.values()]
				.filter(
					(n) =>
						n.contentType === 'news' &&
						(n.entities || []).some((e) => normalizeDiacritics(e) === normalizeDiacritics(entitySlug))
				)
				.slice(0, limit);
		},
	};
}

function findNodeBySlug(nodes, slug) {
	for (const n of nodes.values()) {
		if (n.slug === slug) return n;
	}
	return null;
}

function findNodeByEntity(nodes, entity) {
	const needle = normalizeDiacritics(entity);
	for (const n of nodes.values()) {
		if (normalizeDiacritics(n.slug) === needle) return n;
		if (normalizeDiacritics(n.title) === needle) return n;
	}
	return null;
}

function intersection(a = [], b = []) {
	const setB = new Set((b || []).map((x) => normalizeDiacritics(String(x))));
	return (a || []).filter((x) => setB.has(normalizeDiacritics(String(x))));
}

export default buildContentGraph;
