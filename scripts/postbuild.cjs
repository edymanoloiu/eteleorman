// scripts/postbuild.cjs

const fs = require("fs");
const path = require("path");

const { generateRssFeed } = require("../lib/rss.js");
const { getAllPostsSync } = require("../lib/buildPosts.cjs");

// Cloudflare deploys the "out" folder
const outDir = path.join(__dirname, "..", "out");
const publicDir = path.join(__dirname, "..", "public");

// Ensure out directory exists
if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

function copyPublicEntry(name) {
	const src = path.join(publicDir, name);
	const dest = path.join(outDir, name);
	if (!fs.existsSync(src)) return;
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		fs.cpSync(src, dest, { recursive: true });
	} else {
		fs.copyFileSync(src, dest);
	}
	console.log("📌 Copied:", name);
}

// 1️⃣ Copy SEO files from public/ (build-time sitemaps + robots)
if (fs.existsSync(publicDir)) {
	copyPublicEntry("robots.txt");
	for (const name of fs.readdirSync(publicDir)) {
		if (name === "robots.txt") continue;
		if (
			name === "sitemap.xml" ||
			name === "sitemap-index.xml" ||
			name === "sitemap-articole.xml" ||
			name === "news-sitemap.xml" ||
			name === "sitemaps" ||
			name.startsWith("sitemap")
		) {
			copyPublicEntry(name);
		}
	}
}

// 2️⃣ Generate RSS feed inside "out/"
try {
	const posts = getAllPostsSync([
		"slug",
		"title",
		"excerpt",
		"date",
		"tags",
		"featureImg",
	]);

	const sorted = posts.sort((a, b) => new Date(b.date) - new Date(a.date));
	const xml = generateRssFeed(sorted);

	fs.writeFileSync(path.join(outDir, "rss.xml"), xml);
	fs.writeFileSync(path.join(outDir, "feed.rss"), xml);

	console.log("✅ RSS files written to 'out/'");
	console.log("📂 Final out/ contents:", fs.readdirSync(outDir));
} catch (err) {
	console.error("❌ postbuild failed:", err);
	process.exit(1);
}
