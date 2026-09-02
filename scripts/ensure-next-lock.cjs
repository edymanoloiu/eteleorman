// Ensures .next/lock exists after `next build` exits.
// Next.js 16 removes the lock on clean exit; Vercel's builder still lstats it
// and fails with ENOENT if it's missing.
//
// Sister sites still trace posts/*.md in server NFT output during build, so we
// must NOT delete posts/ here (unlike gazetadecraiova's postsIndex pipeline).
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

if (process.env.VERCEL && process.env.VERCEL_ENV) {
	if (fs.existsSync(cacheDir)) {
		for (const name of ["webpack", "swc", "eslint", "images"]) {
			rmIfExists(path.join(cacheDir, name), `.next/cache/${name}`);
		}
	}

	// Generated markdown mirrors only — safe once evergreen JSON is in /vercel/output.
	rmIfExists(path.join(root, "public", "_evergreen"), "public/_evergreen/");
}

fs.mkdirSync(cacheDir, { recursive: true });
if (!fs.existsSync(previewInfoPath)) {
	fs.writeFileSync(previewInfoPath, "");
	console.log("📌 Ensured .next/cache/.previewinfo for Vercel packaging");
}

fs.writeFileSync(lockPath, "");
console.log("📌 Ensured .next/lock for Vercel packaging");
