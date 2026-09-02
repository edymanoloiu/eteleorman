import { useMemo, useState } from "react";
import Link from "next/link";
import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl, robotsDirective } from "../../../lib/local-knowledge/seo";

const DIACRITICS = { ă: "a", â: "a", î: "i", ș: "s", ț: "t", ş: "s", Ă: "a", Â: "a", Î: "i", Ș: "s", Ț: "t", Ş: "s" };
function norm(t) {
	return String(t || "").split("").map((c) => DIACRITICS[c] || c).join("").toLowerCase();
}

export default function CautaPage({ initialItems }) {
	const [q, setQ] = useState("");
	const [type, setType] = useState("");

	const results = useMemo(() => {
		const query = norm(q).trim();
		if (!query) return [];
		const tokens = query.split(/\s+/).filter(Boolean);
		return (initialItems || [])
			.filter((e) => !type || e.contentType === type)
			.map((e) => {
				let score = 0;
				const hay = e._search || norm([e.title, e.description, e.category].join(" "));
				for (const token of tokens) {
					if (hay.includes(token)) score += 2;
					if (norm(e.title).includes(token)) score += 3;
					if (e.contentType !== "news") score += 1;
				}
				return { ...e, score };
			})
			.filter((e) => e.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 30);
	}, [q, type, initialItems]);

	return (
		<>
			<HeadMeta
				metaTitle="Căutare"
				metaDesc={`Căutare internă pe ${publication.publicationName}.`}
				ogUrl={getCanonicalUrl("/cauta/")}
				canonicalUrl={getCanonicalUrl("/cauta/")}
			/>
			{/* noindex for search UX pages is enforced via meta below when query present — base robots still from HeadMeta; override: */}
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Căutare</h1>
				<p>Căutați știri, ghiduri și pagini locale. Rezultatele căutării nu sunt pagini separate indexabile.</p>
				<form role="search" onSubmit={(e) => e.preventDefault()} className="m-b-xs-30">
					<label htmlFor="q" className="form-label">Termen de căutare</label>
					<input id="q" className="form-control m-b-xs-20" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`ex. primărie, transport, ${publication.city}`} autoComplete="off" />
					<label htmlFor="type" className="form-label">Tip de conținut</label>
					<select id="type" className="form-control" value={type} onChange={(e) => setType(e.target.value)}>
						<option value="">Toate</option>
						<option value="news">Știri</option>
						<option value="guide">Ghiduri</option>
						<option value="institution">Instituții</option>
						<option value="place">Locuri</option>
						<option value="service">Servicii publice</option>
						<option value="event">Evenimente</option>
						<option value="explainer">Explicații</option>
					</select>
				</form>
				{q.trim() ? (
					results.length ? (
						<ul className="list-unstyled">
							{results.map((r) => (
								<li key={r.url + r.slug} className="m-b-xs-20">
									<p style={{ fontSize: 12, marginBottom: 4 }}>{r.contentType}</p>
									<h2 style={{ fontSize: 20 }}><Link href={r.url}>{r.title}</Link></h2>
									<p>{r.description}</p>
								</li>
							))}
						</ul>
					) : (
						<p>Niciun rezultat pentru „{q}”.</p>
					)
				) : (
					<p>Introduceți un termen pentru a începe căutarea.</p>
				)}
			</div></main>
			<FooterOne />
		</>
	);
}

export async function getServerSideProps({ res }) {
	res.setHeader("X-Robots-Tag", "noindex, nofollow");
	let initialItems = [];
	try {
		const fs = await import("fs");
		const path = await import("path");
		const p = path.join(process.cwd(), "public/search-index.json");
		if (fs.existsSync(p)) initialItems = JSON.parse(fs.readFileSync(p, "utf8")).slice(0, 5000);
	} catch {}
	return { props: { initialItems } };
}
