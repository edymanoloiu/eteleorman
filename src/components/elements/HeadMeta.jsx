import Head from 'next/head'
import { useRouter } from 'next/router'
import publication from '../../data/publication'
import { absoluteUrl, getCanonicalUrl, robotsDirective } from '../../../lib/local-knowledge/seo'

const SITE_URL = publication.canonicalDomain.replace(/\/$/, '')
const SITE_NAME = publication.publicationTagline || publication.publicationName
const DEFAULT_OG_IMAGE = absoluteUrl(publication.defaultSocialImage || publication.logo)

const toAbsoluteUrl = (value) => {
	if (!value) return DEFAULT_OG_IMAGE
	return absoluteUrl(value)
}

const HeadMeta = ({
	metaTitle,
	metaDesc,
	metaImg,
	ogUrl,
	ogType,
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
			? `${metaTitle} | ${SITE_NAME}`
			: `${SITE_NAME} | Informații locale din ${publication.city}`
	const description =
		metaDesc ||
		`${SITE_NAME} — știri locale, ghiduri și informații utile din ${publication.city}.`
	const image = toAbsoluteUrl(metaImg)
	const router = useRouter()
	const routePath = router.asPath ? router.asPath.split('#')[0].split('?')[0] : '/'
	const effectiveCanonical = canonicalUrl || ogUrl || getCanonicalUrl(routePath)
	const resolvedOgUrl = ogUrl || effectiveCanonical
	const resolvedOgType = ogType || 'website'
	const robotsContent = robots || robotsDirective()

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

			<meta property="og:title" content={title} />
			<meta property="og:description" content={description} />
			<meta property="og:image" content={image} />
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			<meta property="og:type" content={resolvedOgType} />
			<meta property="og:url" content={resolvedOgUrl} />
			<meta property="og:site_name" content={SITE_NAME} />
			<meta property="og:locale" content={publication.ogLocale || 'ro_RO'} />
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
			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:title" content={title} />
			<meta name="twitter:description" content={description} />
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
				title={`${SITE_NAME} RSS`}
				href={`${SITE_URL}/rss.xml`}
				key="rss-alternate"
			/>
			<link rel="icon" href={publication.favicon || '/images/cropped_image.png'} type="image/png" />
			<link rel="apple-touch-icon" href={publication.favicon || '/images/cropped_image.png'} />
		</Head>
	)
}

export default HeadMeta
