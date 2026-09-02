import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	const mail = publication.correctionEmail || publication.editorialEmail;
	return (
		<>
			<HeadMeta metaTitle="Politica de corecturi" metaDesc="Cum raportăm și corectăm erorile editoriale." ogUrl={getCanonicalUrl("/politica-corecturi/")} canonicalUrl={getCanonicalUrl("/politica-corecturi/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Politica de corecturi</h1>
				<p>Ne propunem să corectăm prompt erorile factuale. Corecțiile substanțiale sunt menționate în pagină.</p>
				<h2 id="raporteaza">Raportați o eroare</h2>
				<p>Trimiteți un e-mail la <a href={`mailto:${mail}?subject=Raportare%20eroare`}>{mail}</a> cu:</p>
				<ul>
					<li>URL-ul paginii</li>
					<li>Descrierea erorii</li>
					<li>Sursa pe care o propuneți, dacă există</li>
				</ul>
			</div></main>
			<FooterOne />
		</>
	);
}
