// Ensures .next/lock exists after `next build` exits.
// Next.js 16 removes the lock on clean exit; Vercel's builder still lstats it
// and fails with ENOENT if it's missing.
//
// Do not delete posts/, public/_evergreen/, or other traced paths here — Vercel's
// serverless packager still lstats files referenced in .nft.json after build.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const nextDir = path.join(root, ".next");
const lockPath = path.join(nextDir, "lock");
const cacheDir = path.join(nextDir, "cache");
const previewInfoPath = path.join(cacheDir, ".previewinfo");

if (!fs.existsSync(nextDir)) {
	console.warn("⚠️  .next directory missing; skip lock stub");
	process.exit(0);
}

fs.mkdirSync(cacheDir, { recursive: true });
if (!fs.existsSync(previewInfoPath)) {
	fs.writeFileSync(previewInfoPath, "");
	console.log("📌 Ensured .next/cache/.previewinfo for Vercel packaging");
}

fs.writeFileSync(lockPath, "");
console.log("📌 Ensured .next/lock for Vercel packaging");
