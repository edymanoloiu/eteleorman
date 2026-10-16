import openNextWorker from "./.open-next/worker.js";

const CACHEABLE_CONTENT_TYPE = /^text\/html(?:;|$)/i;
const PREVIEW_COOKIE = /(?:^|;\s*)(?:__prerender_bypass|__next_preview_data)=/i;
const PRIVATE_PATH_PREFIXES = ["/api/", "/_next/", "/cdn-cgi/"];

function isCacheablePublicRequest(request, response, url) {
	if (request.method !== "GET" && request.method !== "HEAD") return false;
	if (response.status !== 200) return false;
	if (!CACHEABLE_CONTENT_TYPE.test(response.headers.get("content-type") || "")) return false;
	if (response.headers.has("set-cookie")) return false;
	if (request.headers.has("authorization")) return false;
	if (PREVIEW_COOKIE.test(request.headers.get("cookie") || "")) return false;
	if (PRIVATE_PATH_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) return false;
	if (url.searchParams.has("preview") || url.searchParams.has("draft")) return false;
	return true;
}

function edgeTtl(pathname) { return pathname === "/" ? 300 : 3600; }

export default {
	async fetch(request, env, ctx) {
		const response = await openNextWorker.fetch(request, env, ctx);
		const url = new URL(request.url);
		if (!isCacheablePublicRequest(request, response, url)) return response;
				const headers = new Headers(response.headers);
		const ttl = edgeTtl(url.pathname);
		const edgeCache = "public, s-maxage=" + ttl + ", stale-while-revalidate=86400";
		// Override Next SSR defaults that otherwise prevent CDN caching.
		headers.set("Cache-Control", edgeCache);
		headers.set("CDN-Cache-Control", edgeCache);
		headers.set("Cloudflare-CDN-Cache-Control", edgeCache);
		headers.delete("Pragma");
		headers.delete("Expires");
		return new Response(response.body, {
			status: response.status,
			statusText: response.statusText,
			headers,
		});

	},
};
