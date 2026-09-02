import { isRecomandarePost } from './recomandarePosts.js';

/** Canonical URL path for an article (no leading/trailing slashes). */
export function getArticleUrlPath(post) {
	if (!post?.slug) return 'post';
	const segment = isRecomandarePost(post) ? 'recomandare' : 'post';
	return `${segment}/${post.slug}`;
}

export function getPostHref(post) {
	if (!post?.slug) return '/post/';
	return `/${getArticleUrlPath(post)}`;
}
