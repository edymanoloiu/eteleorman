const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const postsDirectory = path.join(process.cwd(), 'posts');
const indexCandidates = [
	path.join(process.cwd(), 'lib', 'postsIndex.json'),
	path.join(process.cwd(), 'public', 'posts-index.json'),
];

let indexCache = null;

function readPostsIndexSync() {
	if (indexCache) return indexCache;

	for (const indexPath of indexCandidates) {
		if (!fs.existsSync(indexPath)) continue;
		const raw = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
		if (Array.isArray(raw)) {
			indexCache = raw;
		} else if (raw && typeof raw === 'object') {
			indexCache = Object.entries(raw).map(([slug, data]) => ({ slug, ...(data || {}) }));
		} else {
			indexCache = [];
		}
		return indexCache;
	}

	if (!fs.existsSync(postsDirectory)) {
		indexCache = [];
		return indexCache;
	}

	indexCache = fs
		.readdirSync(postsDirectory)
		.filter((filename) => filename.endsWith('.md'))
		.map((filename) => {
			const slug = filename.replace(/\.md$/, '');
			const raw = fs.readFileSync(path.join(postsDirectory, filename), 'utf8');
			const { data } = matter(raw);
			return { slug, ...data };
		})
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	return indexCache;
}

function pickFields(data, fields, realSlug) {
	const items = {};

	fields.forEach((field) => {
		if (field === 'slug') {
			items[field] = realSlug;
		} else if (typeof data[field] !== 'undefined') {
			items[field] = data[field];
		}
	});

	return items;
}

function getAllPostsSync(fields = []) {
	return readPostsIndexSync()
		.map((entry) => pickFields(entry, fields, entry.slug))
		.filter((post) => post.slug);
}

module.exports = {
	getAllPostsSync,
	readPostsIndexSync,
};
