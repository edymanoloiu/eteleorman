import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	return (
		<>
			<HeadMeta metaTitle="Politica editorială" metaDesc={`Standardele editoriale ale publicației ${publication.publicationName}.`} ogUrl={getCanonicalUrl("/politica-editoriala/")} canonicalUrl={getCanonicalUrl("/politica-editoriala/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Politica editorială</h1>
				<p>{publication.publicationName} publică informații de interes public pentru {publication.city}. Separăm clar știrile de conținutul evergreen (ghiduri, instituții, servicii).</p>
				<h2>Principii</h2>
				<ul>
					<li>Verificăm informațiile importante din surse primare, atunci când sunt disponibile.</li>
					<li>Marchem actualizările reale; nu modificăm artificial datele pentru a simula prospețimea.</li>
					<li>Nu publicăm pagini subțiri, doorway sau conținut generat doar pentru cuvinte-cheie.</li>
					<li>Corectăm erorile vizibil, conform <a href="/politica-corecturi/">politicii de corecturi</a>.</li>
					<li>Conținutul public este în limba română.</li>
				</ul>
				<h2>Știri vs. ghiduri</h2>
				<p>Știrile reflectă evenimente recente. Ghidurile și paginile de entități sunt resurse durabile, verificate periodic.</p>
			</div></main>
			<FooterOne />
		</>
	);
}
