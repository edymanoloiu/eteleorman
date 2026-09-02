/**
 * Configurație centrală a publicației.
 * Domeniul canonic este explicit — nu se deduce din headere HTTP.
 */

const publication = {
	publicationName: "eTeleorman",
	publicationTagline: "Știrile zilei în Alexandria",
	canonicalDomain: "https://eteleorman.ro",
	city: "Alexandria",
	county: "Teleorman",
	region: "Sud",
	latitude: 43.9833,
	longitude: 25.3333,
	locale: 'ro-RO',
	language: 'ro',
	timezone: 'Europe/Bucharest',
	logo: '/images/logo.png',
	defaultSocialImage: '/images/logo.png',
	favicon: '/images/cropped_image.png',
	editorialEmail: 'contact@weboratory.ro',
	legalCompanyName: 'Weboratory Capital SRL',
	publisherInformation: {
		name: 'Weboratory Capital SRL',
		email: 'contact@weboratory.ro',
		website: 'https://www.weboratory.ro',
	},
	socialProfiles: [],
	foundingDate: '2024-01-01',
	coverageArea: "Municipiul Alexandria și județul Teleorman",
	nearbyLocalities: [],
	mapProvider: 'openstreetmap',
	mapsEnabled: true,
	environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	isIndexable: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview' && process.env.CF_PAGES_BRANCH !== 'preview',
	localCate: "Azi in Alexandria",
	categorySlug: "azi-in-alexandria",
	tagMinIndexCount: 5,
	correctionEmail: 'contact@weboratory.ro',
	ogLocale: 'ro_RO',
};

export default publication;
