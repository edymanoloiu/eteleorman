import partnerSnapshot from "../data/partner-sitemaps.json";

const EMPTY = {
	obliq: [],
	mm: [],
	legal: [],
	sanatate: [],
	gospodar: [],
	azi: [],
	cm: [],
	pc: [],
};

function cloneSnapshot(source = partnerSnapshot) {
	const base = source && typeof source === "object" ? source : EMPTY;
	return {
		obliq: Array.isArray(base.obliq) ? base.obliq.slice(0, 6) : [],
		mm: Array.isArray(base.mm) ? base.mm.slice(0, 6) : [],
		legal: Array.isArray(base.legal) ? base.legal.slice(0, 6) : [],
		sanatate: Array.isArray(base.sanatate) ? base.sanatate.slice(0, 6) : [],
		gospodar: Array.isArray(base.gospodar) ? base.gospodar.slice(0, 6) : [],
		azi: Array.isArray(base.azi) ? base.azi.slice(0, 6) : [],
		cm: Array.isArray(base.cm) ? base.cm.slice(0, 6) : [],
		pc: Array.isArray(base.pc) ? base.pc.slice(0, 10) : [],
	};
}

/**
 * Partner homepage feeds from a build-time snapshot (bundled JSON).
 * Avoids outbound RSS fan-out on Cloudflare Workers SSR so TTFB stays low
 * while partner blocks stay populated. Snapshot is refreshed in
 * `npm run generate:partner-sitemaps` during cf:build / prebuild.
 */
export async function fetchPartnerSitemaps() {
	return cloneSnapshot(partnerSnapshot);
}

export default fetchPartnerSitemaps;
