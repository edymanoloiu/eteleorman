#!/usr/bin/env node
/**
 * Build-time sitemap generation for reliable GSC fetching on Cloudflare Workers.
 * Dynamic SSR sitemaps can time out when loading the full posts bundle.
 */
const fs = require('fs');
const path = require('path');

const { getAllPosts: getAllPostsFromApi } = require('../lib/api.js');
const buildPosts = (() => {
	try {
		return require('../lib/buildPosts.cjs');
	} catch {
		return null;
	}
})();

function getAllPosts(fields = []) {
	if (buildPosts?.getAllPostsSync) {
		return buildPosts.getAllPostsSync(fields);
	}
	const posts = getAllPostsFromApi(fields);
	if (posts && typeof posts.then === 'function') {
		throw new Error('getAllPosts() is async in this repo; add lib/buildPosts.cjs or use postsRawContent.js');
	}
	return posts;
}
const { getArticleUrlPath } = require('../lib/articleRoutes.js');
const { isRecomandarePost } = require('../lib/recomandarePosts.js');
const { loadPublishedEvergreen } = require('../lib/local-knowledge/contentLoader.js');
const { getContentTypeMeta } = require('../lib/local-knowledge/contentTypes.js');
const publication = require('../src/data/publication.js').default;

const ROOT = path.join(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'public', 'sitemaps');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');
const CHUNK_SIZE = 2000;
const NEWS_WINDOW_MS = 1000 * 60 * 60 * 24 * 2;

function xmlEscape(str) {
	return String(str || '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function safeIso(dateValue) {
	if (!dateValue) return null;
	const d = new Date(dateValue);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function buildUrlset(entries) {
	const body = entries
		.map(
			(e) => `
  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ''}
    ${e.priority ? `<priority>${e.priority}</priority>` : ''}
    ${e.lastmod ? `<lastmod>${xmlEscape(e.lastmod)}</lastmod>` : ''}
  </url>`
		)
		.join('');
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}
</urlset>`;
}

function buildNewsSitemap(entries) {
	const body = entries
		.map(
			(e) => `
  <url>
    <loc>${xmlEscape(e.loc)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(e.publicationName)}</news:name>
        <news:language>${xmlEscape(e.language)}</news:language>
      </news:publication>
      <news:publication_date>${xmlEscape(e.publicationDate)}</news:publication_date>
      <news:title>${xmlEscape(e.title)}</news:title>
    </news:news>
  </url>`
		)
		.join('');
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${body}
</urlset>`;
}

function writeFile(name, xml) {
	const filePath = path.join(OUT_DIR, name);
	fs.writeFileSync(filePath, xml, 'utf8');
	return `sitemaps/${name}`;
}

function chunk(array, size) {
	const out = [];
	for (let i = 0; i < array.length; i += size) out.push(array.slice(i, i + size));
	return out;
}

function main() {
	const site = publication.canonicalDomain.replace(/\/$/, '');
	const language = (publication.language || 'ro').slice(0, 2);
	const publicationName = publication.publicationName || 'eTeleorman';
	const feeds = [];

	if (fs.existsSync(OUT_DIR)) {
		for (const file of fs.readdirSync(OUT_DIR)) {
			if (file !== 'manifest.json') fs.unlinkSync(path.join(OUT_DIR, file));
		}
	} else {
		fs.mkdirSync(OUT_DIR, { recursive: true });
	}

	const staticPages = [
		{ loc: `${site}/`, changefreq: 'daily', priority: '1.0' },
		{ loc: `${site}/ghidul-orasului/`, changefreq: 'weekly', priority: '0.9' },
		{ loc: `${site}/institutii/`, changefreq: 'weekly', priority: '0.85' },
		{ loc: `${site}/locuri/`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${site}/evenimente/`, changefreq: 'daily', priority: '0.8' },
		{ loc: `${site}/servicii-publice/`, changefreq: 'weekly', priority: '0.85' },
		{ loc: `${site}/explicatii/`, changefreq: 'weekly', priority: '0.7' },
		{ loc: `${site}/trafic-si-transport/`, changefreq: 'weekly', priority: '0.8' },
		{ loc: `${site}/despre/`, changefreq: 'monthly', priority: '0.5' },
		{ loc: `${site}/politica-editoriala/`, changefreq: 'yearly', priority: '0.3' },
		{ loc: `${site}/politica-corecturi/`, changefreq: 'yearly', priority: '0.3' },
		{ loc: `${site}/recomandare/`, changefreq: 'daily', priority: '0.65' },
		{ loc: `${site}/categorie/${publication.categorySlug}/`, changefreq: 'daily', priority: '0.85' },
		{ loc: `${site}/gdpr/`, changefreq: 'yearly', priority: '0.1' },
		{ loc: `${site}/cookies/`, changefreq: 'yearly', priority: '0.1' },
	];

	const evergreen = loadPublishedEvergreen().map((d) => {
		const meta = getContentTypeMeta(d.contentType);
		return {
			loc: `${site}/${meta.routePrefix}/${d.slug}/`,
			changefreq: 'weekly',
			priority: '0.75',
			lastmod: safeIso(d.dateModified || d.datePublished),
		};
	});

	feeds.push(writeFile('static.xml', buildUrlset([...staticPages, ...evergreen])));

	const posts = getAllPosts(['slug', 'date', 'cate', 'title', 'tags'])
		.filter((p) => p.slug)
		.map((p) => ({
			loc: `${site}/${getArticleUrlPath(p)}/`,
			changefreq: 'daily',
			priority: '0.8',
			lastmod: safeIso(p.date),
		}));

	chunk(posts, CHUNK_SIZE).forEach((group, index) => {
		feeds.push(writeFile(`posts-${index}.xml`, buildUrlset(group)));
	});

	const newsCutoff = Date.now() - NEWS_WINDOW_MS;
	const newsEntries = getAllPosts(['slug', 'date', 'title', 'cate', 'tags'])
		.filter((p) => {
			if (!p?.slug || !p?.title || isRecomandarePost(p)) return false;
			const iso = safeIso(p.date);
			if (!iso) return false;
			const t = new Date(iso).getTime();
			if (t > Date.now() + 60 * 60 * 1000) return false;
			return t >= newsCutoff;
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.map((p) => ({
			loc: `${site}/${getArticleUrlPath(p)}/`,
			publicationName,
			language,
			publicationDate: safeIso(p.date),
			title: p.title,
		}));

	const newsPath = path.join(ROOT, 'public', 'news-sitemap.xml');
	// Serve news-sitemap via SSR (src/pages/news-sitemap.xml.js) so the 48h window
	// never goes stale between deploys. Keep it out of public/ so assets don't shadow SSR.
	if (fs.existsSync(newsPath)) {
		fs.unlinkSync(newsPath);
	}
	if (newsEntries.length > 0) {
		feeds.push('news-sitemap.xml');
	}

	const articleCutoff = Date.now() - 1000 * 60 * 60 * 24 * 90;
	const articleEntries = getAllPosts(['slug', 'date', 'cate', 'title', 'tags'])
		.filter((p) => {
			const t = safeIso(p.date);
			return p?.slug && t && new Date(t).getTime() >= articleCutoff;
		})
		.map((p) => ({
			loc: `${site}/${getArticleUrlPath(p)}/`,
			lastmod: safeIso(p.date),
			changefreq: 'daily',
			priority: '0.8',
		}));

	if (articleEntries.length > 0) {
		fs.writeFileSync(
			path.join(ROOT, 'public', 'sitemap-articole.xml'),
			buildUrlset(articleEntries),
			'utf8'
		);
		feeds.push('sitemap-articole.xml');
	}

	const indexBody = feeds
		.map(
			(f) => `
  <sitemap>
    <loc>${xmlEscape(`${site}/${f}`)}</loc>
  </sitemap>`
		)
		.join('');
	const indexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${indexBody}
</sitemapindex>`;
	fs.writeFileSync(path.join(ROOT, 'public', 'sitemap-index.xml'), indexXml, 'utf8');
	// Common crawler default; avoid 404 on legacy /sitemap.xml submissions.
	fs.writeFileSync(path.join(ROOT, 'public', 'sitemap.xml'), indexXml, 'utf8');

	const manifest = {
		generatedAt: new Date().toISOString(),
		feeds,
	};
	fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

	// Remove stale legacy sitemaps that confuse crawlers.
	for (const stale of ['out/sitemap.xml', 'out/sitemap-0.xml']) {
		const stalePath = path.join(ROOT, stale);
		if (fs.existsSync(stalePath)) fs.unlinkSync(stalePath);
	}

	console.log(`✅ Generated ${feeds.length} sitemap feeds → public/sitemaps/`);
	console.log(feeds.join(', '));
}

main();
