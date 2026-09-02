import { LOCAL_IMAGE_FALLBACK } from './imageFallback.js';

export function getImportedRssImageRaw(data) {
	const enclosure = data?.enclosure?.url;
	if (enclosure) return enclosure;

	const media = data?.['media:content']?.url ?? data?.['media:content']?.$?.url;
	if (media) return media;

	const itunes = data?.['itunes:image']?.$?.href ?? data?.['itunes:image']?.href;
	if (itunes) return itunes;

	const encoded = data?.['content:encoded'] || data?.content || data?.summary || data?.description;
	if (encoded && typeof encoded === 'string') {
		const match = encoded.match(/<img[^>]+src=["']([^"'>]+)["']/i);
		if (match?.[1]) return match[1];
	}

	return null;
}

export function resolveImportedRssImageUrl(data, imageUrl) {
	if (!imageUrl) return null;

	try {
		return new URL(imageUrl).toString();
	} catch {
		// relative path — resolve below
	}

	if (!data?.link) return null;

	try {
		const base = new URL(data.link).origin;
		return new URL(imageUrl, base).toString();
	} catch {
		return null;
	}
}

export function getImportedRssImageUrl(data, fallback = LOCAL_IMAGE_FALLBACK) {
	const raw = getImportedRssImageRaw(data);
	const resolved = resolveImportedRssImageUrl(data, raw);
	return resolved || fallback;
}

/** RSS / partner feed item with absolute image URL for cards. */
export function normalizePartnerFeedItem(item) {
	if (!item) return null;
	const imageUrl = getImportedRssImageUrl(item, '');
	const hasPartnerImage =
		imageUrl && imageUrl !== LOCAL_IMAGE_FALLBACK && /^https?:\/\//i.test(imageUrl);
	return {
		...item,
		slug: item.guid || item.slug || item.link,
		...(hasPartnerImage ? { featureImg: imageUrl } : {}),
	};
}
