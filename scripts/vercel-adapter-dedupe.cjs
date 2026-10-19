/**
 * Vercel injects a Next.js adapter that copies static outputs in parallel.
 * Next 16 emits /404 twice (auto-static page and the static error-doc pass).
 * Two copies of .next/output/static/404.html race, and fs-extra's chmod
 * then fails with ENOENT. Drop duplicate pathnames before the real adapter runs.
 */
const { pathToFileURL } = require("url");

let applyingVercelModifyConfig = false;

async function loadVercelAdapter() {
	const adapterPath = process.env.NEXT_ADAPTER_PATH;
	if (!adapterPath || adapterPath === __filename) return null;
	const mod = await import(pathToFileURL(adapterPath).href);
	return mod.default || mod;
}

function dedupeStaticFiles(outputs) {
	if (!outputs || !Array.isArray(outputs.staticFiles)) return 0;
	const seen = new Set();
	const unique = [];
	for (const file of outputs.staticFiles) {
		const isHtml = typeof file.filePath === "string" && file.filePath.endsWith(".html");
		const key = `${file.pathname || ""}${isHtml ? ".html" : ""}`;
		if (seen.has(key)) continue;
		seen.add(key);
		unique.push(file);
	}
	const removed = outputs.staticFiles.length - unique.length;
	outputs.staticFiles = unique;
	return removed;
}

module.exports = {
	name: "Vercel",
	async modifyConfig(config, context) {
		if (applyingVercelModifyConfig) return config;
		applyingVercelModifyConfig = true;
		try {
			const vercel = await loadVercelAdapter();
			let nextConfig = config;
			if (vercel && typeof vercel.modifyConfig === "function") {
				const result = await vercel.modifyConfig(config, context);
				if (result && typeof result === "object") nextConfig = result;
			}
			nextConfig.adapterPath = __filename;
			return nextConfig;
		} finally {
			applyingVercelModifyConfig = false;
		}
	},
	async onBuildComplete(args) {
		const removed = dedupeStaticFiles(args && args.outputs);
		if (removed > 0) {
			console.log(`Removed ${removed} duplicate static output(s) before Vercel packaging`);
		}
		const vercel = await loadVercelAdapter();
		if (vercel && typeof vercel.onBuildComplete === "function") {
			return vercel.onBuildComplete(args);
		}
	},
};
