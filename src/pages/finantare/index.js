import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	return (
		<>
			<HeadMeta metaTitle="Finanțarea publicației" metaDesc={`Transparență privind finanțarea ${publication.publicationName}.`} ogUrl={getCanonicalUrl("/finantare/")} canonicalUrl={getCanonicalUrl("/finantare/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Finanțarea publicației</h1>
				<p>{publication.publicationName} poate fi susținută prin publicitate, conținut partener marcat și proiecte editoriale ale {publication.legalCompanyName}.</p>
				<p>Conținutul publicitar sau partener este marcat distinct față de materialele redacționale.</p>
			</div></main>
			<FooterOne />
		</>
	);
}
