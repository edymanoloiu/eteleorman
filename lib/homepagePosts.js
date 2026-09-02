import { DateTime } from 'luxon';

const DATE_FORMAT = 'LLL dd yyyy';

/** Promo articles stay featured on the homepage for this many days after publish. */
export const PROMO_HOME_DAYS = 2;

export function parsePostDate(dateStr) {
	const s = String(dateStr ?? '').trim();
	if (!s) return DateTime.invalid('empty');
	try {
		const parsed = DateTime.fromFormat(s, DATE_FORMAT);
		if (parsed.isValid) return parsed;
		const iso = DateTime.fromISO(s);
		if (iso.isValid) return iso;
		const js = new Date(s);
		if (!Number.isNaN(js.getTime())) return DateTime.fromJSDate(js);
		return DateTime.invalid('unparsable');
	} catch {
		return DateTime.invalid('unparsable');
	}
}

/** Newest first. Matches frontmatter format (e.g. "May 17 2026"). */
export function sortPostsByDate(posts) {
	return [...(posts || [])].sort((a, b) => {
		const da = parsePostDate(a.date);
		const db = parsePostDate(b.date);
		if (!da.isValid && !db.isValid) return 0;
		if (!da.isValid) return 1;
		if (!db.isValid) return -1;
		return db.toMillis() - da.toMillis();
	});
}

export function isActivePromo(post, maxDays = PROMO_HOME_DAYS) {
	if (!post?.isPromo) return false;
	const published = parsePostDate(post.date);
	if (!published.isValid) return false;
	const daysSince = Math.floor(DateTime.now().diff(published, 'days').days);
	return daysSince >= 0 && daysSince < maxDays;
}

export function getActivePromos(posts) {
	return sortPostsByDate((posts || []).filter((p) => isActivePromo(p)));
}

export function mergePostsUnique(primary, secondary) {
	const seen = new Set();
	const out = [];
	for (const post of [...primary, ...secondary]) {
		if (!post?.slug || seen.has(post.slug)) continue;
		seen.add(post.slug);
		out.push(post);
	}
	return out;
}

/** Active promos first, then latest local category posts (Soledad / news hubs). */
export function buildLocalPostsWithPromos(uniquePosts, localCate) {
	const activePromos = getActivePromos(uniquePosts);
	const local = sortPostsByDate(
		(uniquePosts || []).filter((p) => p.cate === localCate && !p.isPromo),
	);
	return mergePostsUnique(activePromos, local);
}

/** Picks up to `count` posts; `priority` (e.g. active promos) are taken first, then `pool`. */
export function takeUniquePosts(pool, count, usedSlugs, priority = []) {
	if (count <= 0) return [];
	const out = [];
	for (const post of priority) {
		if (out.length >= count) break;
		if (!post?.slug || usedSlugs.has(post.slug)) continue;
		usedSlugs.add(post.slug);
		out.push(post);
	}
	for (const post of pool || []) {
		if (out.length >= count) break;
		if (!post?.slug || usedSlugs.has(post.slug)) continue;
		usedSlugs.add(post.slug);
		out.push(post);
	}
	return out;
}

/**
 * Ensures every active promo appears in at least one homepage block.
 * `sections` is ordered by visibility; each entry is { key, posts, limit }.
 */
export function ensureActivePromosOnHomepage(activePromos, usedSlugs, sections) {
	const result = Object.fromEntries(sections.map((s) => [s.key, [...s.posts]]));

	for (const promo of activePromos) {
		if (usedSlugs.has(promo.slug)) continue;

		const slot = sections.find((s) => result[s.key].length < s.limit);
		if (slot) {
			result[slot.key].unshift(promo);
			usedSlugs.add(promo.slug);
			continue;
		}

		const fallbackKey = sections[0]?.key;
		if (!fallbackKey) continue;
		result[fallbackKey].unshift(promo);
		const limit = sections[0].limit;
		if (result[fallbackKey].length > limit) {
			const removed = result[fallbackKey].pop();
			if (removed?.slug) usedSlugs.delete(removed.slug);
		}
		usedSlugs.add(promo.slug);
	}

	return result;
}
