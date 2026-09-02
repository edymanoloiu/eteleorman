import Link from 'next/link';
import HeadMeta from '../elements/HeadMeta';
import HeaderOne from '../header/HeaderOne';
import FooterOne from '../footer/FooterOne';
import publication from '../../data/publication';
import { getCanonicalUrl } from '../../../lib/local-knowledge/seo';

const HubPage = ({
	title,
	description,
	pathname,
	items = [],
	emptyMessage = 'Momentan nu există pagini publicate în această secțiune.',
	intro = null,
}) => {
	return (
		<>
			<HeadMeta
				metaTitle={title}
				metaDesc={description}
				ogUrl={getCanonicalUrl(pathname)}
				canonicalUrl={getCanonicalUrl(pathname)}
			/>
			<HeaderOne />
			<main className="section-gap">
				<div className="container" style={{ maxWidth: 900 }}>
					<h1 className="m-b-xs-20">{title}</h1>
					<p className="lead mid grey-dark-three m-b-xs-40">{description}</p>
					{intro}
					{items.length === 0 ? (
						<p>{emptyMessage}</p>
					) : (
						<ul className="list-unstyled">
							{items.map((item) => (
								<li key={item.slug} className="m-b-xs-30" style={{ borderBottom: '1px solid #eee', paddingBottom: 16 }}>
									<p style={{ fontSize: 12, textTransform: 'uppercase', marginBottom: 4 }}>
										{item.typeLabel || item.contentType}
										{item.category ? ` · ${item.category}` : ''}
									</p>
									<h2 style={{ fontSize: 22, marginBottom: 8 }}>
										<Link href={item.href}>{item.title}</Link>
									</h2>
									<p className="mid grey-dark-three mb-0">{item.description}</p>
								</li>
							))}
						</ul>
					)}
					<p className="m-t-xs-40">
						<Link href="/ghidul-orasului/">Ghidul orașului</Link>
						{' · '}
						<Link href={`/categorie/${publication.categorySlug}/`}>Ultimele știri</Link>
						{' · '}
						<Link href="/cauta/">Căutare</Link>
					</p>
				</div>
			</main>
			<FooterOne />
		</>
	);
};

export default HubPage;
