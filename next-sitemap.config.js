const { getAllPosts } = require('./lib/api');
const { isRecomandarePost } = require('./lib/recomandarePosts.js');

const slugify = (text) => {
	if (!text) return '';
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/[^\w-]+/g, '')
		.replace(/--+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
};

const safeIsoDate = (dateValue) => {
	if (!dateValue) return new Date().toISOString();
	const parsed = new Date(dateValue);
	return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
};

module.exports = {
	siteUrl: 'https://eteleorman.ro',
	generateRobotsTxt: false,
	priority: 1,
	transform: async (config, path) => {
		if (path.includes('[')) {
			return null;
		}

		const locPath = path === '/' ? '/' : path;

		return {
			loc: locPath,
			changefreq: config.changefreq || 'daily',
			priority: config.priority || 0.7,
			lastmod: undefined,
		};
	},
	additionalPaths: async () => {
		const posts = getAllPosts(['slug', 'date', 'cate', 'author_name', 'tags']);
		const seenCategories = new Set();
		const seenAuthors = new Set();
		const paths = [];

		paths.push({
			loc: '/recomandare',
			changefreq: 'weekly',
			priority: 0.6,
		});
		posts.forEach((post) => {
			if (post.slug) {
				paths.push({
					loc: isRecomandarePost(post) ? `/recomandare/${post.slug}` : `/post/${post.slug}`,
					changefreq: 'weekly',
					priority: 1,
					lastmod: safeIsoDate(post.date),
				});
			}

			if (post.cate && !isRecomandarePost(post)) {
				const categorySlug = slugify(post.cate);
				if (categorySlug && !seenCategories.has(categorySlug)) {
					seenCategories.add(categorySlug);
					paths.push({
						loc: `/categorie/${categorySlug}`,
						changefreq: 'weekly',
						priority: 0.7,
						lastmod: safeIsoDate(post.date),
					});
				}
			}

			if (post.author_name) {
				const authorSlug = slugify(post.author_name);
				if (authorSlug && !seenAuthors.has(authorSlug)) {
					seenAuthors.add(authorSlug);
					paths.push({
						loc: `/autor/${authorSlug}`,
						changefreq: 'weekly',
						priority: 0.6,
					});
				}
			}
		});

		return paths;
	},
};
