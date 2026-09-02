import Link from 'next/link';
import HeadMeta from '../elements/HeadMeta';
import HeaderOne from '../header/HeaderOne';
import FooterOne from '../footer/FooterOne';
import publication from '../../data/publication';
import { getContentTypeMeta } from '../../../lib/local-knowledge/contentTypes';
import { documentJsonLd, breadcrumbSchema } from '../../../lib/local-knowledge/jsonld';
import { getCanonicalUrl } from '../../../lib/local-knowledge/seo';

function formatRoDate(iso) {
	if (!iso) return null;
	try {
		return new Intl.DateTimeFormat('ro-RO', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
			timeZone: publication.timezone,
		}).format(new Date(iso));
	} catch {
		return iso;
	}
}

const DocumentPage = ({ doc, html, related = [], recentNews = [] }) => {
	const typeMeta = getContentTypeMeta(doc.contentType);
	const pathname = `/${typeMeta.routePrefix}/${doc.slug}/`;
	const breadcrumbs = [
		{ name: 'Acasă', path: '/' },
		{ name: typeMeta.labelRo, path: `/${typeMeta.routePrefix}/` },
		{ name: doc.title, path: pathname },
	];

	const stale =
		doc.reviewedAt &&
		Date.now() - Date.parse(doc.reviewedAt) > 1000 * 60 * 60 * 24 * 180;

	const jsonLd = [documentJsonLd(doc), breadcrumbSchema(breadcrumbs)];

	return (
		<>
			<HeadMeta
				metaTitle={doc.title}
				metaDesc={doc.description}
				metaImg={doc.featuredImage}
				ogUrl={getCanonicalUrl(pathname)}
				canonicalUrl={getCanonicalUrl(pathname)}
				ogType="article"
				articlePublishedTime={doc.datePublished}
				articleModifiedTime={doc.dateModified}
				articleSection={doc.category}
				jsonLd={jsonLd}
			/>
			<HeaderOne />
			<main className="local-knowledge-doc section-gap">
				<div className="container" style={{ maxWidth: 860 }}>
					<nav aria-label="Breadcrumb" className="m-b-xs-20">
						<ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
							{breadcrumbs.map((b, i) => (
								<li key={b.path}>
									{i > 0 ? <span aria-hidden="true"> / </span> : null}
									{i === breadcrumbs.length - 1 ? (
										<span aria-current="page">{b.name}</span>
									) : (
										<Link href={b.path}>{b.name}</Link>
									)}
								</li>
							))}
						</ol>
					</nav>

					<p className="text-uppercase" style={{ letterSpacing: '0.04em', fontSize: 12 }}>
						{typeMeta.labelRo}
						{doc.category ? ` · ${doc.category}` : ''}
						{doc.city ? ` · ${doc.city}` : ''}
					</p>
					<h1 className="m-b-xs-20">{doc.title}</h1>
					<p className="lead mid grey-dark-three">{doc.description}</p>

					<p className="m-b-xs-30" style={{ fontSize: 14 }}>
						{doc.author ? <>Autor: <strong>{doc.author}</strong> · </> : null}
						{doc.datePublished ? <>Publicat: {formatRoDate(doc.datePublished)}</> : null}
						{doc.dateModified && doc.dateModified !== doc.datePublished ? (
							<> · Actualizat: {formatRoDate(doc.dateModified)}</>
						) : null}
						{doc.reviewedAt ? <> · Verificat: {formatRoDate(doc.reviewedAt)}</> : null}
					</p>

					{stale ? (
						<div className="alert alert-warning" role="status">
							Aceste informații nu au fost verificate recent și pot fi depășite. Confirmați datele din sursele oficiale.
						</div>
					) : null}

					{doc.featuredImage ? (
						<figure className="m-b-xs-30">
							{/* eslint-disable-next-line @next/next/no-img-element */}
							<img
								src={doc.featuredImage}
								alt={doc.featuredImageAlt || ''}
								width={1200}
								height={630}
								style={{ width: '100%', height: 'auto' }}
							/>
						</figure>
					) : null}

					<article
						className="post-content"
						dangerouslySetInnerHTML={{ __html: html }}
					/>

					{(doc.address || doc.telephone || doc.email || doc.website) && (
						<section className="m-t-xs-40" aria-labelledby="date-esentiale">
							<h2 id="date-esentiale">Date esențiale</h2>
							<ul>
								{doc.address ? <li><strong>Adresă:</strong> {doc.address}</li> : null}
								{doc.telephone ? (
									<li>
										<strong>Telefon:</strong>{' '}
										<a href={`tel:${doc.telephone}`}>{doc.telephone}</a>
									</li>
								) : null}
								{doc.email ? (
									<li>
										<strong>E-mail:</strong>{' '}
										<a href={`mailto:${doc.email}`}>{doc.email}</a>
									</li>
								) : null}
								{doc.website ? (
									<li>
										<strong>Website:</strong>{' '}
										<a href={doc.website} rel="noopener noreferrer" target="_blank">
											{doc.website}
										</a>
									</li>
								) : null}
								{doc.openingHours ? <li><strong>Program:</strong> {doc.openingHours}</li> : null}
							</ul>
							{doc.map && doc.latitude && doc.longitude ? (
								<p>
									<a
										href={`https://www.openstreetmap.org/?mlat=${doc.latitude}&mlon=${doc.longitude}#map=16/${doc.latitude}/${doc.longitude}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										Vezi locația pe OpenStreetMap
									</a>
									{' · '}
									<a
										href={`https://www.openstreetmap.org/directions?to=${doc.latitude},${doc.longitude}`}
										rel="noopener noreferrer"
										target="_blank"
									>
										Indicații de orientare
									</a>
								</p>
							) : null}
						</section>
					)}

					{Array.isArray(doc.sources) && doc.sources.length > 0 ? (
						<section className="m-t-xs-40" aria-labelledby="surse">
							<h2 id="surse">Surse</h2>
							<ul>
								{doc.sources.map((s, i) => (
									<li key={i}>
										{s.url ? (
											<a href={s.url} rel="noopener noreferrer" target="_blank">
												{s.name || s.url}
											</a>
										) : (
											s.name
										)}
										{s.accessedAt ? ` (accesat ${s.accessedAt})` : ''}
									</li>
								))}
							</ul>
						</section>
					) : null}

					<section className="m-t-xs-40" aria-labelledby="corecturi">
						<h2 id="corecturi">Corecturi</h2>
						<p>
							Ați găsit o eroare?{' '}
							<a href={`mailto:${publication.correctionEmail || publication.editorialEmail}?subject=${encodeURIComponent('Corecție: ' + doc.title)}`}>
								Raportați o eroare către redacție
							</a>
							{' '}sau citiți{' '}
							<Link href="/politica-corecturi/">politica de corecturi</Link>.
						</p>
					</section>

					{related.length > 0 ? (
						<section className="m-t-xs-40" aria-labelledby="asociate">
							<h2 id="asociate">Pagini asociate</h2>
							<ul>
								{related.map((r) => (
									<li key={r.id}>
										<Link href={r.href}>{r.title}</Link>
									</li>
								))}
							</ul>
						</section>
					) : null}

					{recentNews.length > 0 ? (
						<section className="m-t-xs-40" aria-labelledby="stiri-recente">
							<h2 id="stiri-recente">Știri recente relevante</h2>
							<ul>
								{recentNews.map((r) => (
									<li key={r.id}>
										<Link href={r.href}>{r.title}</Link>
									</li>
								))}
							</ul>
						</section>
					) : null}
				</div>
			</main>
			<FooterOne />
		</>
	);
};

export default DocumentPage;
