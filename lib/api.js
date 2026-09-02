import matter from 'gray-matter';
import publication from '../src/data/publication.js';

// Import the JSON that contains all posts raw markdown content, keyed by slug
import postsRawContent from './postsRawContent.js'

// Get all post slugs from the JSON keys
export function getPostSlugs() {
	return Object.keys(postsRawContent);
}

// Get a post by slug and return requested fields
export function getPostBySlug(slug, fields = []) {
	const realSlug = slug.replace(/\.md$/, '');
	const rawMarkdown = postsRawContent[realSlug];
	if (!rawMarkdown)
		return {};

	const { data, content } = matter(rawMarkdown);
	const items = {};

	fields.forEach((field) => {
		if (field === 'slug') {
			items[field] = realSlug;
		}
		if (field === 'content') {
			items[field] = content;
		}
		if (typeof data[field] !== 'undefined') {
			items[field] = data[field];
		}
	});

	return items;
}

// Get all posts with requested fields
export function getAllPosts(fields = []) {
	const slugs = getPostSlugs();

	const posts = slugs
		.map((slug) => getPostBySlug(slug, fields))
		.filter((post) => post !== null);

	return posts;
}

// Get markdown file content by slug from JSON data
export function getFileContentBySlug(slug) {
	const realSlug = slug.replace(/\.md$/, '');
	const rawMarkdown = postsRawContent[realSlug];
	if (!rawMarkdown)
		return {};

	const { data, content } = matter(rawMarkdown);

	return { data, content };
}

export function getPostCreationDate(slug) {
	const post = getPostBySlug(slug, ['date']);
	if (!post || !post.date) {
		return null;
	}
	return {
		createdAt: new Date(post.date).toISOString(),
	};
}
