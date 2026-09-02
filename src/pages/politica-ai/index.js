import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	return (
		<>
			<HeadMeta metaTitle="Politica privind inteligența artificială" metaDesc={`Cum folosim inteligența artificială la ${publication.publicationName}.`} ogUrl={getCanonicalUrl("/politica-ai/")} canonicalUrl={getCanonicalUrl("/politica-ai/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Politica privind inteligența artificială</h1>
				<p>Putem folosi instrumente de inteligență artificială pentru asistență la redactare, structurare sau ilustrare. Responsabilitatea editorială rămâne a redacției.</p>
				<ul>
					<li>Nu prezentăm imagini generate de AI ca fotografii reale ale unor evenimente.</li>
					<li>Nu fabricăm surse, autori, recenzii, prețuri sau programe.</li>
					<li>Informațiile factuale locale trebuie verificate înainte de publicare.</li>
				</ul>
			</div></main>
			<FooterOne />
		</>
	);
}
