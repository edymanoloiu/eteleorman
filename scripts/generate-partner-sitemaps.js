/**
 * Prefetch partner homepage RSS into data/partner-sitemaps.json.
 * Homepage SSR reads this snapshot (no outbound feed fan-out on Cloudflare).
 */
const fs = require("fs");
const path = require("path");
const Parser = require("rss-parser");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "data", "partner-sitemaps.json");

const FEEDS = [
	{ key: "obliq", url: "https://obliqdesign.ro/rss.xml", limit: 6 },
	{ key: "mm", url: "https://meritasamergi.ro/rss.xml", limit: 6 },
	{ key: "legal", url: "https://ghidullegal.ro/rss.xml", limit: 6 },
	{ key: "sanatate", url: "https://sfaturidesanatate.ro/rss.xml", limit: 6 },
	{ key: "gospodar", url: "https://ghidulgospodarului.ro/rss.xml", limit: 6 },
	{ key: "azi", url: "https://azicemancam.ro/rss.xml", limit: 6 },
	{ key: "pc", url: "https://painesicirc.ro/rss.xml", limit: 10 },
];

const CM_URLS = [
	"https://cautimasina.ro/feed.rss",
	"https://cautimasina.ro/rss.xml",
];

const HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (compatible; EteleormanFeedReader/1.0; +https://eteleorman.ro))",
	Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
};

const TIMEOUT_MS = 12_000;
const MAX_BYTES = 512_000;

function slimItem(item) {
	if (!item?.title || !item?.link) return null;
	return {
		title: String(item.title),
		link: String(item.link),
		isoDate: item.isoDate || item.pubDate || null,
		pubDate: item.pubDate || null,
		contentSnippet: String(
			item.contentSnippet || item.content || item.summary || "",
		).slice(0, 400),
		guid: item.guid || item.id || item.link,
		creator: item.creator || item.author || null,
		enclosure: item.enclosure?.url
			? { url: item.enclosure.url }
			: undefined,
	};
}

async function fetchXml(url) {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
	try {
		const res = await fetch(url, {
			headers: HEADERS,
			signal: ac.signal,
			redirect: "follow",
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const buf = Buffer.from(await res.arrayBuffer());
		return buf.subarray(0, MAX_BYTES).toString("utf8");
	} finally {
		clearTimeout(timer);
	}
}

async function fetchFeed(url, limit) {
	const parser = new Parser();
	const xml = await fetchXml(url);
	const parsed = await parser.parseString(xml);
	return (parsed.items || [])
		.map(slimItem)
		.filter(Boolean)
		.slice(0, limit);
}

async function fetchCautiMasina(limit = 6) {
	for (const url of CM_URLS) {
		try {
			const items = await fetchFeed(url, limit * 2);
			const filtered = items
				.filter((item) => /cautimasina\.ro/i.test(item.link))
				.slice(0, limit);
			if (filtered.length) return filtered;
		} catch {
			// try next
		}
	}
	// keep previous cm from existing snapshot / cautimasina-feed.json if live fails
	try {
		const prev = JSON.parse(fs.readFileSync(OUT, "utf8"));
		if (Array.isArray(prev.cm) && prev.cm.length) return prev.cm.slice(0, limit);
	} catch {
		// ignore
	}
	try {
		const fallback = JSON.parse(
			fs.readFileSync(path.join(ROOT, "data", "cautimasina-feed.json"), "utf8"),
		);
		return (fallback.items || [])
			.map(slimItem)
			.filter(Boolean)
			.filter((item) => /cautimasina\.ro/i.test(item.link))
			.slice(0, limit);
	} catch {
		return [];
	}
}

async function main() {
	const out = {
		generatedAt: new Date().toISOString(),
		obliq: [],
		mm: [],
		legal: [],
		sanatate: [],
		gospodar: [],
		azi: [],
		cm: [],
		pc: [],
	};

	const settled = await Promise.allSettled(
		FEEDS.map(async ({ key, url, limit }) => {
			const items = await fetchFeed(url, limit);
			return { key, items };
		}),
	);

	for (const result of settled) {
		if (result.status !== "fulfilled") {
			console.warn("feed failed:", result.reason?.message || result.reason);
			continue;
		}
		out[result.value.key] = result.value.items;
		console.log(`${result.value.key}: ${result.value.items.length} items`);
	}

	out.cm = await fetchCautiMasina(6);
	console.log(`cm: ${out.cm.length} items`);

	fs.mkdirSync(path.dirname(OUT), { recursive: true });
	fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`, "utf8");
	console.log("Wrote", OUT);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
