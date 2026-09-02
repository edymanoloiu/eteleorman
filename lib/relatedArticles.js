/**
 * Deterministic related-article ranking from category, tags, and recency.
 * Avoids linking every article to the same newest posts.
 */

function normalize(value) {
	return String(value || '')
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.trim();
}

function parseDate(value) {
	if (!value) return 0;
	const t = new Date(value).getTime();
	return Number.isNaN(t) ? 0 : t;
}

function tagSet(post) {
	const tags = Array.isArray(post?.tags) ? post.tags : [];
	return new Set(tags.map(normalize).filter(Boolean));
}

/**
 * @param {object} current
 * @param {object[]} candidates
 * @param {{ limit?: number }} [options]
 */
export function getRelatedArticles(current, candidates, { limit = 5 } = {}) {
	if (!current?.slug || !Array.isArray(candidates) || candidates.length === 0) {
		return [];
	}

	const currentTags = tagSet(current);
	const currentCate = normalize(current.cate);
	const currentTime = parseDate(current.date);
	const scored = [];

	for (const other of candidates) {
		if (!other?.slug || other.slug === current.slug) continue;
		if (other.isPromo) continue;

		let score = 0;
		const otherCate = normalize(other.cate);
		if (currentCate && otherCate && currentCate === otherCate) score += 5;

		const otherTags = tagSet(other);
		let overlap = 0;
		for (const tag of currentTags) {
			if (otherTags.has(tag)) overlap += 1;
		}
		score += overlap * 3;

		const otherTime = parseDate(other.date);
		if (currentTime && otherTime) {
			const dayDiff = Math.abs(currentTime - otherTime) / (1000 * 60 * 60 * 24);
			if (dayDiff <= 7) score += 2;
			else if (dayDiff <= 30) score += 1;
			// Mild recency tie-break without drowning topical matches
			score += Math.max(0, 1 - dayDiff / 365) * 0.5;
		}

		if (score > 0) {
			scored.push({ post: other, score });
		}
	}

	scored.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return parseDate(b.post.date) - parseDate(a.post.date);
	});

	return scored.slice(0, limit).map((row) => row.post);
}

export default getRelatedArticles;
