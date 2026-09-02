import publication from '../src/data/publication.js';

let postsIndexCache = null;
let postsIndexPromise = null;

function siteBase(origin) {
	// Prefer the production domain for static JSON assets. Deployment URLs
	// (*.vercel.app) often 302 with a plain-text body, which breaks res.json().
	const raw =
		origin ||
		process.env.NEXT_PUBLIC_SITE_URL ||
		publication?.canonicalDomain ||
		(process.env.VERCEL_PROJECT_PRODUCTION_URL
			? `https://${String(process.env.VERCEL_PROJECT_PRODUCTION_URL).replace(/^https?:\/\//, '')}`
			: null) ||
		'https://eteleorman.ro';

	return String(raw).replace(/\/$/, '');
}

async function readIndexFromPublicFs() {
	// Only during local/build — on Vercel the public/ tree is not in the lambda FS.
	if (process.env.VERCEL) return null;
	try {
		const fs = await import('fs');
		const path = await import('path');
		const publicPath = path.join(process.cwd(), 'public', 'posts-index.json');
		if (fs.existsSync(publicPath)) {
			return JSON.parse(fs.readFileSync(publicPath, 'utf8'));
		}
	} catch {
		// ignore
	}
	return null;
}

async function fetchPostsIndex(origin) {
	const bases = [
		siteBase(origin),
		publication?.canonicalDomain,
		'https://eteleorman.ro',
	].filter(Boolean);

	const seen = new Set();
	for (const base of bases) {
		const normalized = base.replace(/\/$/, '');
		if (seen.has(normalized)) continue;
		seen.add(normalized);
		const url = `${normalized}/posts-index.json`;
		try {
			const res = await fetch(url, {
				redirect: 'follow',
				headers: { Accept: 'application/json' },
			});
			const contentType = res.headers.get('content-type') || '';
			if (!res.ok) continue;
			if (!contentType.includes('json') && !contentType.includes('octet-stream') && !contentType.includes('text/plain')) {
				continue;
			}
			const data = await res.json();
			if (data && typeof data === 'object' && !Array.isArray(data)) {
				return data;
			}
		} catch {
			// try next base
		}
	}
	return null;
}

/**
 * Listings load the index from the CDN asset (public/posts-index.json).
 */
export async function loadPostsIndex(origin) {
	if (postsIndexCache) return postsIndexCache;
	if (postsIndexPromise) return postsIndexPromise;

	postsIndexPromise = (async () => {
		const fromDisk = await readIndexFromPublicFs();
		if (fromDisk) {
			postsIndexCache = fromDisk;
			return postsIndexCache;
		}

		const fetched = await fetchPostsIndex(origin);
		if (fetched) {
			postsIndexCache = fetched;
			return postsIndexCache;
		}

		console.error('Failed to load posts-index.json from disk or CDN');
		postsIndexCache = {};
		return postsIndexCache;
	})();

	try {
		return await postsIndexPromise;
	} finally {
		postsIndexPromise = null;
	}
}

export async function getPostSlugs() {
	return Object.keys(await loadPostsIndex());
}

export async function getAllPosts(fields = []) {
	const postsIndex = await loadPostsIndex();
	return Object.keys(postsIndex)
		.map((slug) => {
			const data = postsIndex[slug];
			if (!data) return null;
			const items = {};
			fields.forEach((field) => {
				if (field === 'slug') items[field] = slug;
				else if (typeof data[field] !== 'undefined') items[field] = data[field];
			});
			return items;
		})
		.filter(Boolean);
}

export async function getPostCreationDate(slug) {
	const realSlug = String(Array.isArray(slug) ? slug[0] : slug || '').replace(/\.md$/, '');
	const data = (await loadPostsIndex())[realSlug];
	if (!data || !data.date) return null;
	return { createdAt: new Date(data.date).toISOString() };
}

export async function getAllPostsSlugs() {
	return (await getPostSlugs()).map((slug) => slug.replace(/\.md$/, ''));
}

export { siteBase };
