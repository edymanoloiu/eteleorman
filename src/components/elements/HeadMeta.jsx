import Head from 'next/head'
import { useRouter } from 'next/router'
import publication from '../../data/publication'
import { absoluteUrl, getCanonicalUrl, robotsDirective } from '../../../lib/local-knowledge/seo'

const SITE_URL = publication.canonicalDomain.replace(/\/$/, '')
const SEO = publication.seo || {}
const BRAND = publication.publicationName
const TITLE_TEMPLATE = SEO.titleTemplate || `%s | ${BRAND}`
const DEFAULT_OG_IMAGE = absoluteUrl(publication.defaultSocialImage || publication.logo)

const toAbsoluteUrl = (value) => {
	if (!value) return DEFAULT_OG_IMAGE
	return absoluteUrl(value)
}

const formatTitle = (pageTitle) => TITLE_TEMPLATE.replace('%s', pageTitle)

const HeadMeta = ({
	metaTitle,
	metaDesc,
	metaImg,
	ogUrl,
	ogType,
	ogTitle,
	ogDescription,
	twitterTitle,
	twitterDescription,
	canonicalUrl,
	keywords,
	articlePublishedTime,
	articleModifiedTime,
	articleSection,
	jsonLd,
	/** When set, used as the full document <title> (no template suffix). */
	fullPageTitle,
	robots,
}) => {
	const title = fullPageTitle
		? fullPageTitle
		: metaTitle
			? formatTitle(metaTitle)
			: SEO.title || `${BRAND} | Informații locale din ${publication.city}`
	const description =
		metaDesc ||
		SEO.description ||
		`${publication.publicationTagline} — știri locale din ${publication.city}.`
	const resolvedOgTitle = ogTitle || title
	const resolvedOgDescription = ogDescription || description
	const resolvedTwitterTitle = twitterTitle || resolvedOgTitle
	const resolvedTwitterDescription = twitterDescription || resolvedOgDescription
	const ogSiteName = SEO.openGraph?.siteName || BRAND
	const image = toAbsoluteUrl(metaImg)
	const router = useRouter()
	const routePath = router.asPath ? router.asPath.split('#')[0].split('?')[0] : '/'
	const effectiveCanonical = canonicalUrl || ogUrl || getCanonicalUrl(routePath)
	const resolvedOgUrl = ogUrl || effectiveCanonical
	const resolvedOgType = ogType || SEO.openGraph?.type || 'website'
	const robotsContent = robots || robotsDirective()
	const twitterCard = SEO.twitter?.card || 'summary_large_image'

	const jsonLdString = (() => {
		if (!jsonLd) return null
		if (Array.isArray(jsonLd)) {
			return JSON.stringify({
				'@context': 'https://schema.org',
				'@graph': jsonLd.map((item) => {
					if (!item || typeof item !== 'object') return item
					const { '@context': _ctx, ...rest } = item
					return rest
				}),
			})
		}
		if (typeof jsonLd === 'object') return JSON.stringify(jsonLd)
		return null
	})()

	return (
		<Head>
			<meta charSet="utf-8" />
			<meta httpEquiv="x-ua-compatible" content="ie=edge" />
			<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

			<title>{title}</title>
			<meta name="description" content={description} />
			<meta name="robots" content={robotsContent} />
			<link rel="canonical" href={effectiveCanonical} key="canonical" />

			<meta property="og:title" content={resolvedOgTitle} />
			<meta property="og:description" content={resolvedOgDescription} />
			<meta property="og:image" content={image} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:type" content={resolvedOgType} />
			<meta property="og:url" content={resolvedOgUrl} />
			<meta property="og:site_name" content={ogSiteName} />
			<meta property="og:locale" content={SEO.openGraph?.locale || publication.ogLocale || 'ro_RO'} />
			{keywords ? <meta name="keywords" content={keywords} /> : null}
			{articlePublishedTime ? (
				<meta property="article:published_time" content={articlePublishedTime} />
			) : null}
			{articleModifiedTime ? (
				<meta property="article:modified_time" content={articleModifiedTime} />
			) : null}
			{articleSection ? <meta property="article:section" content={articleSection} /> : null}

			<meta name="ai-content" content={resolvedOgType === 'article' ? 'ai-assisted; human-reviewed' : 'not-applicable'} />
			<meta name="ai-image" content="generated-or-stock-or-own" />
			<meta name="editorial-responsibility" content={publication.legalCompanyName} />
			<meta name="twitter:card" content={twitterCard} />
			<meta name="twitter:title" content={resolvedTwitterTitle} />
			<meta name="twitter:description" content={resolvedTwitterDescription} />
			<meta name="twitter:image" content={image} />
			{jsonLdString ? (
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: jsonLdString }}
					key="article-jsonld"
				/>
			) : null}

			<link
				rel="alternate"
				type="application/rss+xml"
				title={`${BRAND} RSS`}
				href={`${SITE_URL}/rss.xml`}
				key="rss-alternate"
			/>
			<link rel="icon" href={publication.favicon || '/images/cropped_image.png'} type="image/png" />
			<link rel="apple-touch-icon" href={publication.favicon || '/images/cropped_image.png'} />
		</Head>
	)
}

export default HeadMeta
