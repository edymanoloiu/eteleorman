import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	return (
		<>
			<HeadMeta metaTitle="Politica de atribuire și surse" metaDesc="Cum atribuim și cităm sursele." ogUrl={getCanonicalUrl("/politica-surse/")} canonicalUrl={getCanonicalUrl("/politica-surse/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Politica de atribuire și surse</h1>
				<p>{publication.publicationName} indică sursele relevante pentru informațiile factuale, cu preferință pentru surse primare (instituții, documente oficiale).</p>
				<p>Când un material pornește de la o altă publicație, credităm sursa și adăugăm context local verificat.</p>
			</div></main>
			<FooterOne />
		</>
	);
}
