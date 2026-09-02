/**
 * Configurație centrală a publicației.
 * Domeniul canonic este explicit — nu se deduce din headere HTTP.
 */

const publication = {
	publicationName: "eTeleorman",
	publicationTagline: "Teleormanul de azi",
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
	coverageArea: "Județul Teleorman, România",
	editorialPositioning:
		"Publicație județeană axată pe viața reală din Teleorman, de la administrație și infrastructură până la agricultură și comunitățile locale.",
	nearbyLocalities: ["Roșiorii de Vede", "Turnu Măgurele", "Videle", "Zimnicea"],
	mapProvider: 'openstreetmap',
	mapsEnabled: true,
	environment: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	isIndexable: process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'preview' && process.env.CF_PAGES_BRANCH !== 'preview',
	localCate: "Azi in Alexandria",
	categorySlug: "azi-in-alexandria",
	tagMinIndexCount: 5,
	correctionEmail: 'contact@weboratory.ro',
	ogLocale: 'ro_RO',
	seo: {
		title: "eTeleorman - Știri din Teleorman și Alexandria",
		titleTemplate: "%s | eTeleorman",
		description:
			"Știri din Teleorman, Alexandria, Roșiorii de Vede, Turnu Măgurele și Videle. Actualitate locală, administrație, evenimente, agricultură, trafic și comunitate.",
		homepageH1: "Știri din Teleorman",
		homepageIntro:
			"Informații locale din Alexandria și întreg județul Teleorman, de la administrație și infrastructură până la agricultură, economie și evenimente.",
		openGraph: {
			type: "website",
			siteName: "eTeleorman",
			title: "eTeleorman - Actualitatea județului Teleorman",
			description:
				"Știri și informații din Alexandria, Roșiorii de Vede, Turnu Măgurele, Videle și toate comunitățile din Teleorman.",
			locale: "ro_RO",
		},
		twitter: {
			card: "summary_large_image",
			title: "eTeleorman - Știri din Teleorman",
			description:
				"Actualitate, administrație, agricultură, evenimente și informații utile din județul Teleorman.",
		},
		schema: {
			type: "NewsMediaOrganization",
			name: "eTeleorman",
			alternateName: "eTeleorman.ro",
			areaServed: "Județul Teleorman, România",
		},
	},
};

export default publication;
