import fs from "fs";
import path from "path";
import Parser from "rss-parser";

const CAUTI_MASINA_FEED_URLS = [
	"https://cautimasina.ro/feed.rss",
	"https://cautimasina.ro/rss.xml",
];

const HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (compatible; EteleormanFeedReader/1.0; +https://eteleorman.ro)",
	Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
};

const FEED_TIMEOUT_MS = 1000;

function normalizeItems(items = [], limit = 6) {
	return (items || [])
		.filter(
			(item) =>
				item?.title &&
				item?.link &&
				/cautimasina\.ro/i.test(String(item.link)),
		)
		.slice(0, limit)
		.map((item) => ({
			title: item.title,
			link: item.link,
			isoDate: item.isoDate || item.pubDate || null,
			pubDate: item.pubDate || null,
			contentSnippet: item.contentSnippet || item.content || item.summary || "",
			content: item.content || item.contentSnippet || "",
			guid: item.guid || item.link,
		}));
}

function readBundledFallback(limit = 6) {
	try {
		const filePath = path.join(process.cwd(), "data", "cautimasina-feed.json");
		const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
		return normalizeItems(raw?.items || [], limit);
	} catch {
		return [];
	}
}

async function fetchFeedXml(url, timeoutMs = FEED_TIMEOUT_MS) {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), timeoutMs);
	try {
		const res = await fetch(url, {
			method: "GET",
			headers: HEADERS,
			signal: ac.signal,
			redirect: "follow",
		});
		if (!res.ok) {
			throw new Error(`HTTP ${res.status}`);
		}
		const text = await res.text();
		if (!text || text.length < 80) {
			throw new Error("empty feed body");
		}
		return text;
	} finally {
		clearTimeout(timer);
	}
}

/**
 * Live CautiMasina RSS is often blocked (429). One short attempt per URL,
 * then the bundled snapshot — never multi-second retry loops on the homepage.
 */
export async function fetchCautiMasinaItems(_parser, limit = 6) {
	const parser = _parser instanceof Parser ? _parser : new Parser();

	for (const url of CAUTI_MASINA_FEED_URLS) {
		try {
			const xml = await fetchFeedXml(url);
			const feed = await parser.parseString(xml);
			const items = normalizeItems(feed?.items || [], limit);
			if (items.length) return items;
		} catch {
			// try next URL, then bundled fallback
		}
	}

	return readBundledFallback(limit);
}

export default fetchCautiMasinaItems;
