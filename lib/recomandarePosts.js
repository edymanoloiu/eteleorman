/** Frontmatter tags that route articles to /recomandare/[slug] and hide them from normal listings. */
const RECOMMANDARE_TAGS = new Set([
	'recomandare',
	'recomandare partener',
]);

function normalizeTagList(tags) {
	if (tags == null) return [];
	if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
	return [String(tags).trim()].filter(Boolean);
}

export function isRecomandarePost(post) {
	if (!post) return false;
	return normalizeTagList(post.tags).some((t) =>
		RECOMMANDARE_TAGS.has(t.toLowerCase())
	);
}

/** Drops duplicate post objects when the same slug appears in merged homepage slices (e.g. local + promo). */
export function dedupePostsBySlug(posts) {
	if (!posts?.length) return [];
	const seen = new Set();
	const out = [];
	for (const p of posts) {
		if (!p?.slug || seen.has(p.slug)) continue;
		seen.add(p.slug);
		out.push(p);
	}
	return out;
}
