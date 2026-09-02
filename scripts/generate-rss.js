import { generateRssFeed } from '../lib/rss.js';
import { getAllPosts } from '../lib/api.js';
import { isRecomandarePost } from '../lib/recomandarePosts.js';
import { writeFileSync } from 'fs';

(async function () {
	const posts = await getAllPosts(['slug', 'title', 'excerpt', 'date', 'tags', 'featureImg', 'author_name', 'cate']);
	const filtered = posts.filter((p) => !isRecomandarePost(p));
	const xml = generateRssFeed(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
	writeFileSync('./public/rss.xml', xml);
	writeFileSync('./public/feed.rss', xml);
})();