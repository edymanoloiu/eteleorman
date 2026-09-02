// Ensures .next/lock exists after `next build` exits.
// Next.js 16 removes the lock on clean exit; Vercel's builder still lstats it
// and fails with ENOENT if it's missing.
//
// On Vercel, free disk before "Deploying outputs" (ENOSPC). Only remove paths
// that are NOT re-read from disk during packaging — deleting public/ images or
// JSON after build produced empty deploy artifacts. posts/ markdown and
// generated mirrors under public/_* are safe once JSON indexes exist.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");
const lockPath = path.join(nextDir, "lock");
const cacheDir = path.join(nextDir, "cache");
const previewInfoPath = path.join(cacheDir, ".previewinfo");

function rmIfExists(target, label) {
	if (!fs.existsSync(target)) return false;
	fs.rmSync(target, { recursive: true, force: true });
	console.log(`📌 Removed ${label} to free Vercel deploy disk`);
	return true;
}

if (!fs.existsSync(nextDir)) {
	console.warn("⚠️  .next directory missing; skip lock stub");
	process.exit(0);
}

// Require VERCEL_ENV so a local VERCEL=1 experiment cannot wipe the tree.
if (process.env.VERCEL && process.env.VERCEL_ENV) {
	if (fs.existsSync(cacheDir)) {
		for (const name of ["webpack", "swc", "eslint", "images"]) {
			rmIfExists(path.join(cacheDir, name), `.next/cache/${name}`);
		}
	}

	// Markdown already baked into posts-*.json during prebuild (~40MB).
	rmIfExists(path.join(root, "posts"), "posts/");
	// Generated mirrors — static JSON/CDN assets already in /vercel/output.
	rmIfExists(path.join(root, "public", "_posts"), "public/_posts/");
	rmIfExists(path.join(root, "public", "_evergreen"), "public/_evergreen/");

	// Build-only copies under lib/ (public/*.json stays for packaging).
	rmIfExists(path.join(root, "lib", "postsIndex.json"), "lib/postsIndex.json");

	// Free ~250MB git pack before Vercel "Deploying outputs" (ENOSPC).
	rmIfExists(path.join(root, ".git"), ".git/");
}

fs.mkdirSync(cacheDir, { recursive: true });
if (!fs.existsSync(previewInfoPath)) {
	fs.writeFileSync(previewInfoPath, "");
	console.log("📌 Ensured .next/cache/.previewinfo for Vercel packaging");
}

fs.writeFileSync(lockPath, "");
console.log("📌 Ensured .next/lock for Vercel packaging");
