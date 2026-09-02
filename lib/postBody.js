import { loadPostsIndex, siteBase } from './postsList.js';

let postsBodiesCache = null;
let postsBodiesPromise = null;

async function loadPostsBodies(origin) {
	if (postsBodiesCache) return postsBodiesCache;
	if (postsBodiesPromise) return postsBodiesPromise;

	postsBodiesPromise = (async () => {
		if (!process.env.VERCEL) {
			try {
				const fs = await import('fs');
				const path = await import('path');
				const local = path.join(process.cwd(), 'public', 'posts-bodies.json');
				if (fs.existsSync(local)) {
					postsBodiesCache = JSON.parse(fs.readFileSync(local, 'utf8'));
					return postsBodiesCache;
				}
			} catch {
				// fall through to fetch
			}
		}

		const url = `${siteBase(origin)}/posts-bodies.json`;
		const res = await fetch(url, {
			redirect: 'follow',
			headers: { Accept: 'application/json' },
		});
		if (!res.ok) {
			console.error(`Failed to load posts-bodies.json from ${url} (${res.status})`);
			postsBodiesCache = {};
			return postsBodiesCache;
		}
		postsBodiesCache = await res.json();
		return postsBodiesCache;
	})();

	try {
		return await postsBodiesPromise;
	} finally {
		postsBodiesPromise = null;
	}
}

/**
 * Article-body loader. Bodies are a single public CDN JSON file (not traced into lambdas).
 */
export async function getPostBySlug(slug, fields = [], options = {}) {
	const slugStr =
		typeof slug === 'string' ? slug : Array.isArray(slug) ? slug[0] : String(slug || '');
	const realSlug = slugStr.replace(/\.md$/, '');
	const needContent = fields.includes('content');
	const postsIndex = await loadPostsIndex(options.origin);
	const data = postsIndex[realSlug];

	let content = null;
	if (needContent) {
		const bodies = await loadPostsBodies(options.origin);
		if (bodies && typeof bodies[realSlug] === 'string') {
			content = bodies[realSlug];
		}
	}

	if (!data && content == null) return {};

	const items = {};
	fields.forEach((field) => {
		if (field === 'slug') items[field] = realSlug;
		else if (field === 'content') items[field] = content || '';
		else if (data && typeof data[field] !== 'undefined') items[field] = data[field];
	});
	return items;
}

export async function getFileContentBySlug(slug, options = {}) {
	const post = await getPostBySlug(
		slug,
		['slug', 'content', 'title', 'excerpt', 'date', 'cate', 'featureImg', 'tags', 'author_name'],
		options
	);
	if (!post || !post.slug) return {};
	const { content, slug: _s, ...data } = post;
	return { data, content: content || '' };
}
