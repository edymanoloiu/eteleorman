import publication from '../../src/data/publication.js';
import { getContentTypeMeta } from './contentTypes.js';

export function getCanonicalUrl(pathname) {
	const base = publication.canonicalDomain.replace(/\/$/, '');
	if (!pathname || pathname === '/') return `${base}/`;
	const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
	return path.endsWith('/') ? `${base}${path}` : `${base}${path}/`;
}

export function absoluteUrl(pathOrUrl) {
	if (!pathOrUrl) return getCanonicalUrl(publication.defaultSocialImage);
	if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
	const base = publication.canonicalDomain.replace(/\/$/, '');
	return `${base}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export function robotsDirective({ indexable } = {}) {
	const allow = indexable ?? publication.isIndexable;
	if (!allow) return 'noindex, nofollow';
	return 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
}

export function buildPageMeta({
	title,
	description,
	pathname,
	image,
	ogType = 'website',
	articlePublishedTime,
	articleModifiedTime,
	articleSection,
	fullPageTitle,
}) {
	const siteName = publication.publicationTagline || publication.publicationName;
	const resolvedTitle = fullPageTitle || (title ? `${title} | ${siteName}` : siteName);
	const canonical = getCanonicalUrl(pathname);
	return {
		title: resolvedTitle,
		description:
			description ||
			`${publication.publicationTagline} — informații locale utile din ${publication.city}.`,
		canonical,
		ogUrl: canonical,
		ogType,
		image: absoluteUrl(image || publication.defaultSocialImage),
		robots: robotsDirective(),
		locale: publication.ogLocale,
		siteName,
		articlePublishedTime,
		articleModifiedTime,
		articleSection,
	};
}

export function buildDocumentMeta(doc) {
	const typeMeta = getContentTypeMeta(doc.contentType);
	const pathname = typeMeta?.routePrefix
		? `/${typeMeta.routePrefix}/${doc.slug}/`
		: `/${doc.slug}/`;
	return buildPageMeta({
		title: doc.title,
		description: doc.description,
		pathname,
		image: doc.featuredImage,
		ogType: doc.contentType === 'news' ? 'article' : 'article',
		articlePublishedTime: doc.datePublished,
		articleModifiedTime: doc.dateModified,
		articleSection: doc.category,
	});
}

export default buildPageMeta;
