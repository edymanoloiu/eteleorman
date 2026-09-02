// scripts/generate-posts-json.js
// Builds:
// - lib/postsIndex.json + public/posts-index.json (frontmatter only, for listings)
// - lib/postsBodies.json (markdown bodies only, one file — traced into article lambdas)
// Avoids shipping 5k+ individual .md files into Vercel deploy outputs.

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'posts');
const indexOutPath = path.join(process.cwd(), 'lib', 'postsIndex.json');
const publicIndexOutPath = path.join(process.cwd(), 'public', 'posts-index.json');
const bodiesOutPath = path.join(process.cwd(), 'public', 'posts-bodies.json');
const legacyJsIndexPath = path.join(process.cwd(), 'lib', 'postsIndex.js');
const legacyRawPath = path.join(process.cwd(), 'lib', 'postsRawContent.js');
const legacyBodiesInLib = path.join(process.cwd(), 'lib', 'postsBodies.json');
const legacyBodiesInContentData = path.join(process.cwd(), 'content-data', 'postsBodies.json');
const publicPostsDir = path.join(process.cwd(), 'public', '_posts');

/** Only fields needed for listings / getAllPosts. */
const INDEX_STORE_KEYS = new Set([
	'postFormat',
	'trending',
	'story',
	'title',
	'excerpt',
	'featureImg',
	'thumb',
	'cate',
	'cate_bg',
	'cate_img',
	'author_name',
	'author_img',
	'author_bio',
	'author_social',
	'author_desg',
	'date',
	'post_views',
	'post_share',
	'read_time',
	'featureImgSrc',
	'isPromo',
	'tags',
	'gallery',
	'videoLink',
	'audioLink',
	'quoteText',
	'hasScript',
	'hasOwnScript',
	'script',
]);

function pickForIndex(data) {
	const o = {};
	for (const key of INDEX_STORE_KEYS) {
		if (data[key] === undefined || data[key] === null) continue;
		let v = data[key];
		if (key === 'author_bio' && typeof v === 'string' && v.length > 450) {
			v = `${v.slice(0, 450)}…`;
		}
		o[key] = v;
	}
	return o;
}

async function generatePostsIndex() {
	const files = fs.readdirSync(postsDirectory);
	const postsIndex = {};
	const postsBodies = {};

	// Optional Cloudflare/local static copies. Skip on Vercel (too many files for deploy).
	const copyToPublic = process.env.COPY_POSTS_TO_PUBLIC === '1' || !process.env.VERCEL;
	if (copyToPublic) {
		fs.mkdirSync(publicPostsDir, { recursive: true });
	}

	for (const filename of files) {
		if (!filename.endsWith('.md')) continue;
		const slug = filename.replace(/\.md$/, '');
		const fullPath = path.join(postsDirectory, filename);
		const raw = fs.readFileSync(fullPath, 'utf8');
		const { data, content } = matter(raw);
		postsIndex[slug] = JSON.parse(JSON.stringify(pickForIndex(data)));
		postsBodies[slug] = content;
		if (copyToPublic) {
			fs.copyFileSync(fullPath, path.join(publicPostsDir, filename));
		}
	}

	fs.mkdirSync(path.dirname(bodiesOutPath), { recursive: true });
	fs.writeFileSync(indexOutPath, JSON.stringify(postsIndex));
	fs.writeFileSync(publicIndexOutPath, JSON.stringify(postsIndex));
	fs.writeFileSync(bodiesOutPath, JSON.stringify(postsBodies));

	for (const legacy of [legacyJsIndexPath, legacyRawPath, legacyBodiesInLib, legacyBodiesInContentData]) {
		if (fs.existsSync(legacy)) fs.unlinkSync(legacy);
	}

	const extra = copyToPublic ? ' + public/_posts/*.md' : ' (skipped public/_posts on Vercel)';
	console.log(
		`✅ Generated posts-index + posts-bodies.json (${Object.keys(postsIndex).length} posts)${extra}`
	);
}

generatePostsIndex().catch((err) => {
	console.error(err);
	process.exit(1);
});
