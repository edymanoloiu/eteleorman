import { createRequire } from 'module';
import { generateRssFeed } from '../lib/rss.js';
import { isRecomandarePost } from '../lib/recomandarePosts.js';
import { writeFileSync } from 'fs';

const require = createRequire(import.meta.url);
const { getAllPostsSync } = require('../lib/buildPosts.cjs');

const posts = getAllPostsSync(['slug', 'title', 'excerpt', 'date', 'tags', 'featureImg', 'author_name', 'cate']);
const filtered = posts.filter((p) => !isRecomandarePost(p));
const xml = generateRssFeed(filtered.sort((a, b) => new Date(b.date) - new Date(a.date)));
writeFileSync('./public/rss.xml', xml);
writeFileSync('./public/feed.rss', xml);
