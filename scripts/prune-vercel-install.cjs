// Run after `npm install` on Vercel to free disk before the Next build.
// Vercel Linux (gnu) only needs @next/swc-linux-x64-gnu; the musl + other
// platform optional packages are ~120MB+ each and tip ENOSPC during packaging.
const fs = require("fs");
const path = require("path");

if (!process.env.VERCEL || !process.env.VERCEL_ENV) {
	process.exit(0);
}

const nextPkgs = path.join(__dirname, "..", "node_modules", "@next");
if (!fs.existsSync(nextPkgs)) {
	process.exit(0);
}

const arch = process.arch === "arm64" ? "arm64" : "x64";
const keepName = `swc-linux-${arch}-gnu`;

let removed = 0;
for (const name of fs.readdirSync(nextPkgs)) {
	if (!name.startsWith("swc-")) continue;
	if (name === keepName) continue;
	const target = path.join(nextPkgs, name);
	fs.rmSync(target, { recursive: true, force: true });
	console.log(`📌 prune-vercel-install: removed node_modules/@next/${name}`);
	removed += 1;
}

if (!removed) {
	console.log("📌 prune-vercel-install: no unused @next/swc-* packages to remove");
}
