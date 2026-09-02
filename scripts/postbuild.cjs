// scripts/postbuild.cjs

const fs = require("fs");
const path = require("path");

const { generateRssFeed } = require("../lib/rss.js");
const { getAllPosts } = require("../lib/api.js");

// Cloudflare deploys the "out" folder
const outDir = path.join(__dirname, "..", "out");
const publicDir = path.join(__dirname, "..", "public");

// Ensure out directory exists
if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

// 1️⃣ Copy static SEO files from public/ (sitemaps are served by src/pages/*.xml.js — do not ship public/sitemap*.xml)
if (fs.existsSync(publicDir)) {
	const files = fs.readdirSync(publicDir).filter((file) => file === "robots.txt");

	files.forEach((file) => {
		fs.copyFileSync(path.join(publicDir, file), path.join(outDir, file));
		console.log("📌 Copied:", file);
	});
}

// 2️⃣ Generate RSS feed inside "out/"
(async function () {
	const posts = await getAllPosts([
		"slug",
		"title",
		"excerpt",
		"date",
		"tags",
		"featureImg",
	]);

	const sorted = posts.sort(
		(a, b) => new Date(b.date) - new Date(a.date)
	);

	const xml = generateRssFeed(sorted);

	fs.writeFileSync(path.join(outDir, "rss.xml"), xml);
	fs.writeFileSync(path.join(outDir, "feed.rss"), xml);

	console.log("✅ RSS files written to 'out/'");

	// Remove stale legacy sitemaps from out/ (served from public/ at build time).
	for (const stale of ["sitemap.xml", "sitemap-0.xml"]) {
		const stalePath = path.join(outDir, stale);
		if (fs.existsSync(stalePath)) {
			fs.unlinkSync(stalePath);
			console.log("🗑️ Removed stale:", stale);
		}
	}

	console.log("📂 Final out/ contents:", fs.readdirSync(outDir));
})().catch((err) => {
	console.error("❌ postbuild failed:", err);
	process.exit(1);
});
