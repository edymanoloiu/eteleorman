import publication from '../../src/data/publication.js';
import { absoluteUrl, getCanonicalUrl } from './seo.js';
import { getContentTypeMeta } from './contentTypes.js';

export function websiteSchema() {
	return {
		'@context': 'https://schema.org',
		'@type': 'WebSite',
		name: publication.publicationName,
		url: publication.canonicalDomain,
		inLanguage: publication.locale,
		publisher: {
			'@type': 'Organization',
			name: publication.legalCompanyName,
			url: publication.publisherInformation.website,
		},
		potentialAction: {
			'@type': 'SearchAction',
			target: `${publication.canonicalDomain}/cauta/?q={search_term_string}`,
			'query-input': 'required name=search_term_string',
		},
	};
}

export function organizationSchema() {
	const schema = publication.seo?.schema || {};
	return {
		'@context': 'https://schema.org',
		'@type': schema.type || 'NewsMediaOrganization',
		name: schema.name || publication.publicationName,
		alternateName: schema.alternateName,
		areaServed: schema.areaServed || publication.coverageArea,
		url: publication.canonicalDomain,
		logo: absoluteUrl(publication.logo),
		email: publication.editorialEmail,
		foundingDate: publication.foundingDate,
		sameAs: publication.socialProfiles,
		address: {
			'@type': 'PostalAddress',
			addressLocality: publication.city,
			addressRegion: publication.county,
			addressCountry: 'RO',
		},
	};
}

export function breadcrumbSchema(items) {
	return {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: items.map((item, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			name: item.name,
			item: getCanonicalUrl(item.path),
		})),
	};
}

export function documentJsonLd(doc) {
	const typeMeta = getContentTypeMeta(doc.contentType);
	const url = typeMeta?.routePrefix
		? getCanonicalUrl(`/${typeMeta.routePrefix}/${doc.slug}/`)
		: getCanonicalUrl(`/${doc.slug}/`);

	const base = {
		'@context': 'https://schema.org',
		headline: doc.title,
		description: doc.description,
		datePublished: doc.datePublished,
		dateModified: doc.dateModified || doc.datePublished,
		inLanguage: publication.locale,
		mainEntityOfPage: url,
		author: {
			'@type': 'Person',
			name: typeof doc.author === 'string' ? doc.author : doc.author?.name || 'Redacția',
		},
		publisher: {
			'@type': 'Organization',
			name: publication.publicationName,
			logo: {
				'@type': 'ImageObject',
				url: absoluteUrl(publication.logo),
			},
		},
	};

	if (doc.featuredImage) {
		base.image = [absoluteUrl(doc.featuredImage)];
	}

	switch (doc.contentType) {
		case 'news':
			return { ...base, '@type': 'NewsArticle', articleSection: doc.category };
		case 'guide':
		case 'service':
		case 'explainer':
			return { ...base, '@type': 'Article', articleSection: doc.category };
		case 'person':
			return {
				'@context': 'https://schema.org',
				'@type': 'Person',
				name: doc.title,
				description: doc.description,
				url,
			};
		case 'institution':
			return {
				'@context': 'https://schema.org',
				'@type': 'GovernmentOrganization',
				name: doc.title,
				description: doc.description,
				url,
				address: doc.address
					? { '@type': 'PostalAddress', streetAddress: doc.address, addressLocality: doc.city, addressCountry: 'RO' }
					: undefined,
				telephone: doc.telephone,
				email: doc.email,
				sameAs: doc.website ? [doc.website] : undefined,
			};
		case 'organization':
			return {
				'@context': 'https://schema.org',
				'@type': 'Organization',
				name: doc.title,
				description: doc.description,
				url,
				telephone: doc.telephone,
				email: doc.email,
				sameAs: doc.website ? [doc.website] : undefined,
			};
		case 'place':
			return {
				'@context': 'https://schema.org',
				'@type': doc.schemaSubtype || 'Place',
				name: doc.title,
				description: doc.description,
				url,
				geo:
					doc.latitude && doc.longitude
						? { '@type': 'GeoCoordinates', latitude: doc.latitude, longitude: doc.longitude }
						: undefined,
				address: doc.address
					? { '@type': 'PostalAddress', streetAddress: doc.address, addressLocality: doc.city, addressCountry: 'RO' }
					: undefined,
			};
		case 'event':
			return {
				'@context': 'https://schema.org',
				'@type': 'Event',
				name: doc.title,
				description: doc.description,
				url,
				startDate: doc.eventStart,
				endDate: doc.eventEnd,
				eventStatus: doc.eventStatus || 'https://schema.org/EventScheduled',
				eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
				location: doc.address
					? {
							'@type': 'Place',
							name: doc.location || doc.title,
							address: doc.address,
					  }
					: undefined,
				organizer: doc.organizer
					? { '@type': 'Organization', name: doc.organizer }
					: undefined,
			};
		default:
			return { ...base, '@type': 'Article' };
	}
}

export default documentJsonLd;
