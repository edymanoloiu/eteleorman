import markdownToHtml from '../markdownToHtml.js';
import { getEvergreenBySlug, loadPublishedEvergreen } from './contentLoader.js';
import { buildContentGraph } from './contentGraph.js';
import { getAllPosts } from '../api.js';

export async function getDocumentPageProps(contentType, params) {
	const slug = params?.slug;
	if (!slug) return { notFound: true };

	const doc = getEvergreenBySlug(contentType, slug);
	if (!doc) return { notFound: true };

	const html = await markdownToHtml(doc.body || '');
	const newsPosts = await getAllPosts(['slug', 'title', 'date', 'cate', 'tags', 'excerpt']);
	const evergreen = loadPublishedEvergreen();
	const graph = buildContentGraph({ newsPosts, evergreenDocs: evergreen });
	const related = graph.getRelated(slug, { limit: 6 });
	const recentNews = graph
		.getByType('news')
		.filter((n) => (n.tags || []).some((t) => (doc.tags || []).includes(t)))
		.slice(0, 5);

	return {
		props: {
			doc: {
				...doc,
				body: undefined,
			},
			html,
			related: related.map(({ id, title, href, contentType: ct }) => ({ id, title, href, contentType: ct })),
			recentNews: recentNews.map(({ id, title, href }) => ({ id, title, href })),
		},
	};
}

export async function getHubItems(contentType) {
	const { getContentTypeMeta } = await import('./contentTypes.js');
	const meta = getContentTypeMeta(contentType);
	const docs = loadPublishedEvergreen().filter((d) => d.contentType === contentType);
	return docs
		.sort((a, b) => Date.parse(b.dateModified || b.datePublished) - Date.parse(a.dateModified || a.datePublished))
		.map((d) => ({
			slug: d.slug,
			title: d.title,
			description: d.description,
			category: d.category,
			contentType: d.contentType,
			typeLabel: meta.labelRo,
			href: `/${meta.routePrefix}/${d.slug}/`,
		}));
}

export default getDocumentPageProps;
