/** Canonical URL segment + slug for articles (no leading slash; trailing slash added by callers). */

import { isRecomandarePost } from './recomandarePosts.js';

/** Live public article sections for this site (Pages Router). */
export const ARTICLE_SECTIONS = ['post', 'recomandare'];

/**
 * Path prefix for an article.
 * Published URLs are /post/{slug}/ (and /recomandare/{slug}/ for promo).
 * Do not invent /stiri|/cultura|/meteo section detail routes — they do not exist here.
 * @param {{ slug?: string, cate?: string, title?: string, tags?: string[] }} post
 * @returns {'post'|'recomandare'}
 */
export function getArticlePathPrefix(post) {
	if (!post || !post.slug) return 'post';
	if (isRecomandarePost(post)) return 'recomandare';
	return 'post';
}

/**
 * @param {{ slug?: string }} post
 * @returns {string} e.g. "post/my-slug"
 */
export function getArticleUrlPath(post) {
	if (!post || !post.slug) return 'post';
	return `${getArticlePathPrefix(post)}/${post.slug}`;
}

/** Path for Next.js Link / absolute URL builders (with trailing slash). */
export function getPostHref(post) {
	return `/${getArticleUrlPath(post)}/`;
}

export function isValidArticleSection(section) {
	return ARTICLE_SECTIONS.includes(section);
}
