/** Tipuri interne (EN) → etichete publice (RO) */

export const CONTENT_TYPES = {
	news: {
		id: 'news',
		labelRo: 'Știre',
		dir: 'posts',
		routePrefix: null, // folosește rutele existente /{section}/{slug}/
		schemaType: 'NewsArticle',
		sitemap: 'news',
	},
	guide: {
		id: 'guide',
		labelRo: 'Ghid',
		dir: 'content/guides',
		routePrefix: 'ghidul-orasului',
		schemaType: 'Article',
		sitemap: 'guides',
	},
	place: {
		id: 'place',
		labelRo: 'Loc',
		dir: 'content/places',
		routePrefix: 'locuri',
		schemaType: 'Place',
		sitemap: 'entities',
	},
	institution: {
		id: 'institution',
		labelRo: 'Instituție',
		dir: 'content/institutions',
		routePrefix: 'institutii',
		schemaType: 'GovernmentOrganization',
		sitemap: 'entities',
	},
	person: {
		id: 'person',
		labelRo: 'Persoană',
		dir: 'content/people',
		routePrefix: 'persoane',
		schemaType: 'Person',
		sitemap: 'entities',
	},
	organization: {
		id: 'organization',
		labelRo: 'Organizație',
		dir: 'content/organizations',
		routePrefix: 'organizatii',
		schemaType: 'Organization',
		sitemap: 'entities',
	},
	event: {
		id: 'event',
		labelRo: 'Eveniment',
		dir: 'content/events',
		routePrefix: 'evenimente',
		schemaType: 'Event',
		sitemap: 'events',
	},
	service: {
		id: 'service',
		labelRo: 'Serviciu public',
		dir: 'content/services',
		routePrefix: 'servicii-publice',
		schemaType: 'Article',
		sitemap: 'guides',
	},
	explainer: {
		id: 'explainer',
		labelRo: 'Material explicativ',
		dir: 'content/explainers',
		routePrefix: 'explicatii',
		schemaType: 'Article',
		sitemap: 'guides',
	},
};

export const CONTENT_TYPE_IDS = Object.keys(CONTENT_TYPES);

export const PUBLIC_STATUSES = ['draft', 'review', 'published', 'archived'];

export const EVERGREEN_DIRS = Object.values(CONTENT_TYPES)
	.filter((t) => t.id !== 'news')
	.map((t) => t.dir);

export function getContentTypeMeta(contentType) {
	return CONTENT_TYPES[contentType] || null;
}

export function getPublicHref(doc) {
	const meta = getContentTypeMeta(doc.contentType);
	if (!meta) return null;
	if (doc.contentType === 'news') {
		return null; // folosește getPostHref din lib/postHref.js / lib/articleRoutes.js (/post/{slug}/)
	}
	return `/${meta.routePrefix}/${doc.slug}/`;
}

export default CONTENT_TYPES;
