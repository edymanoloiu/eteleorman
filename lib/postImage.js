import { LOCAL_IMAGE_FALLBACK } from './imageFallback';
import { getImportedRssImageUrl, resolveImportedRssImageUrl } from './importedRssImage';

function resolveLocalOrPartnerImageUrl(post, url) {
	const trimmed = url != null ? String(url).trim() : '';
	if (!trimmed) return '';
	if (/^https?:\/\//i.test(trimmed)) return trimmed;
	if (trimmed.startsWith('//')) {
		try {
			return new URL(`https:${trimmed}`).toString();
		} catch {
			return trimmed;
		}
	}
	// RSS often uses /images/posts/... — resolve on partner site when link is external
	if (post?.link && /^https?:\/\//i.test(String(post.link))) {
		const resolved = resolveImportedRssImageUrl(post, trimmed);
		if (resolved) return resolved;
	}
	return trimmed;
}

/** Primary image URL for cards and listings (thumb → featureImg → RSS → fallback). */
export function getPostImageSrc(post) {
	const thumb = resolveLocalOrPartnerImageUrl(post, post?.thumb);
	const feature = resolveLocalOrPartnerImageUrl(post, post?.featureImg);
	if (thumb || feature) return thumb || feature;
	return getImportedRssImageUrl(post, LOCAL_IMAGE_FALLBACK);
}
