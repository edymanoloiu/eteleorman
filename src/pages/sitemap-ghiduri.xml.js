import { loadPublishedEvergreen } from '../../lib/local-knowledge/contentLoader';
import { getContentTypeMeta } from '../../lib/local-knowledge/contentTypes';
import { xmlEscape } from '../../lib/xmlEscape';
import publication from '../data/publication';

const TYPES = new Set(['guide', 'service', 'explainer']);

function buildUrlset(entries) {
	const body = entries.map((e) => `
  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <lastmod>${xmlEscape(e.lastmod || '')}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
}

export default function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
	const site = publication.canonicalDomain.replace(/\/$/, '');
	const docs = loadPublishedEvergreen().filter((d) => TYPES.has(d.contentType));
	const entries = docs.map((d) => {
		const meta = getContentTypeMeta(d.contentType);
		return {
			loc: `${site}/${meta.routePrefix}/${d.slug}/`,
			lastmod: d.dateModified || d.datePublished,
		};
	});
if (!entries.length) {
		res.statusCode = 404;
		res.end();
		return { props: {} };
	}
	res.setHeader('Content-Type', 'text/xml; charset=utf-8');

	res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
	res.write(buildUrlset(entries));
	res.end();
	return { props: {} };
}
