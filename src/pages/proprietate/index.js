import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

export default function Page() {
	return (
		<>
			<HeadMeta metaTitle="Proprietatea publicației" metaDesc={`Cine deține ${publication.publicationName}.`} ogUrl={getCanonicalUrl("/proprietate/")} canonicalUrl={getCanonicalUrl("/proprietate/")} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>Proprietatea publicației</h1>
				<p>{publication.publicationName} este operat de <strong>{publication.legalCompanyName}</strong>.</p>
				<p>Website editor: <a href={publication.publisherInformation.website} rel="noopener noreferrer" target="_blank">{publication.publisherInformation.website}</a></p>
				<p>Contact: <a href={`mailto:${publication.publisherInformation.email}`}>{publication.publisherInformation.email}</a></p>
			</div></main>
			<FooterOne />
		</>
	);
}
