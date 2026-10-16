import Parser from "rss-parser";
import { fetchCautiMasinaItems } from "./cautimasinaFeed";

const FEED_URLS = [
	"https://obliqdesign.ro/rss.xml",
	"https://meritasamergi.ro/rss.xml",
	"https://ghidullegal.ro/rss.xml",
	"https://sfaturidesanatate.ro/rss.xml",
	"https://ghidulgospodarului.ro/rss.xml",
	"https://azicemancam.ro/rss.xml",
	"https://painesicirc.ro/rss.xml",
];

const HEADERS = {
	"User-Agent":
		"Mozilla/5.0 (compatible; EteleormanFeedReader/1.0; +https://eteleorman.ro)",
	Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
};

/** Cap download size — azicemancam RSS alone is ~2MB and stalls Workers SSR. */
const MAX_FEED_BYTES = 96_000;
const FEED_TIMEOUT_MS = 1200;

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
		const reader = res.body?.getReader?.();
		if (!reader) {
			const text = await res.text();
			if (!text || text.length < 80) throw new Error("empty feed body");
			return text.slice(0, MAX_FEED_BYTES);
		}
		const chunks = [];
		let total = 0;
		while (total < MAX_FEED_BYTES) {
			const { done, value } = await reader.read();
			if (done) break;
			chunks.push(value);
			total += value.byteLength;
		}
		try {
			await reader.cancel();
		} catch {
			// ignore cancel errors
		}
		const merged = new Uint8Array(total);
		let offset = 0;
		for (const chunk of chunks) {
			merged.set(chunk, offset);
			offset += chunk.byteLength;
		}
		const text = new TextDecoder("utf-8").decode(merged);
		if (!text || text.length < 80) throw new Error("empty feed body");
		return text;
	} finally {
		clearTimeout(timer);
	}
}

function itemsFromSettled(result) {
	if (!result || result.status !== "fulfilled" || !result.value?.items?.length) {
		return [];
	}
	return result.value.items;
}

/**
 * Partner homepage feeds. Uses global fetch + parseString so it works on
 * Cloudflare Workers / OpenNext (rss-parser parseURL uses Node http and stalls there).
 * Hard timeout + body cap keep homepage TTFB bounded on cache miss.
 */
export async function fetchPartnerSitemaps() {
	const parser = new Parser();
	const [settled, cm] = await Promise.all([
		Promise.allSettled(
			FEED_URLS.map(async (url) => {
				const xml = await fetchFeedXml(url);
				return parser.parseString(xml);
			}),
		),
		fetchCautiMasinaItems(null, 6),
	]);

	return {
		obliq: itemsFromSettled(settled[0]).slice(0, 6),
		mm: itemsFromSettled(settled[1]).slice(0, 6),
		legal: itemsFromSettled(settled[2]).slice(0, 6),
		sanatate: itemsFromSettled(settled[3]).slice(0, 6),
		gospodar: itemsFromSettled(settled[4]).slice(0, 6),
		azi: itemsFromSettled(settled[5]).slice(0, 6),
		cm,
		pc: itemsFromSettled(settled[6]).slice(0, 10),
	};
}
