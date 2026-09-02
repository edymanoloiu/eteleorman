import { getAllPosts } from '../../lib/api';
import { getArticleUrlPath } from '../../lib/articleRoutes';
import { isRecomandarePost } from '../../lib/recomandarePosts';
import { xmlEscape } from '../../lib/xmlEscape';
import publication from '../data/publication';

const FORTY_EIGHT_H_MS = 48 * 60 * 60 * 1000;

function toPublicationIso(dateValue) {
	const d = new Date(dateValue);
	if (Number.isNaN(d.getTime())) return null;
	return d.toISOString();
}

export default function NewsSitemapXml() {
	return null;
}

export async function getServerSideProps({ res }) {
	const site = publication.canonicalDomain.replace(/\/$/, '');
	const publicationName = publication.publicationName || site.replace(/^https?:\/\//, '');
	const language = (publication.language || 'ro').slice(0, 2);
	const cutoff = Date.now() - FORTY_EIGHT_H_MS;
	const now = Date.now();

	const rawPosts = getAllPosts(['slug', 'date', 'title', 'cate', 'tags']);
	const posts = (await Promise.resolve(rawPosts))
		.filter((p) => {
			if (!p?.slug || !p?.title || isRecomandarePost(p)) return false;
			const iso = toPublicationIso(p.date);
			if (!iso) return false;
			const t = new Date(iso).getTime();
			if (t > now + 60 * 60 * 1000) return false;
			return t >= cutoff;
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	if (!posts.length) {
		res.statusCode = 404;
		res.end();
		return { props: {} };
	}

	const items = posts
		.map((p) => {
			const loc = `${site}/${getArticleUrlPath(p)}/`;
			const pub = toPublicationIso(p.date);
			return `
  <url>
    <loc>${xmlEscape(loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(publicationName)}</news:name>
        <news:language>${xmlEscape(language)}</news:language>
      </news:publication>
      <news:publication_date>${xmlEscape(pub)}</news:publication_date>
      <news:title>${xmlEscape(p.title)}</news:title>
    </news:news>
  </url>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${items}
</urlset>`;

	res.setHeader('Content-Type', 'text/xml; charset=utf-8');
	res.setHeader('Cache-Control', 'no-store, max-age=60');
	res.write(xml);
	res.end();

	return { props: {} };
}
