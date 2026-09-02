import Link from "next/link";
import HeadMeta from "../../components/elements/HeadMeta";
import HeaderOne from "../../components/header/HeaderOne";
import FooterOne from "../../components/footer/FooterOne";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";
import { organizationSchema, websiteSchema } from "../../../lib/local-knowledge/jsonld";

export default function DesprePage() {
	const title = `Despre ${publication.publicationName}`;
	const desc = `${publication.publicationName} este o publicație locală pentru ${publication.city}, parte din rețeaua Weboratory.`;
	return (
		<>
			<HeadMeta metaTitle={title} metaDesc={desc} ogUrl={getCanonicalUrl("/despre/")} canonicalUrl={getCanonicalUrl("/despre/")} jsonLd={[organizationSchema(), websiteSchema()]} />
			<HeaderOne />
			<main className="section-gap"><div className="container" style={{ maxWidth: 800 }}>
				<h1>{title}</h1>
				<p>{publication.publicationName} publică știri locale verificate și construiește o bază de cunoaștere utilă pentru {publication.city} și {publication.county}.</p>
				<p>Nu suntem doar un flux cronologic de articole: urmărim să acoperim instituții, servicii publice, ghiduri practice și entități locale cu informații clare, surse și actualizări.</p>
				<p><strong>Zona acoperită:</strong> {publication.coverageArea}</p>
				<p><strong>Contact redacție:</strong> <a href={`mailto:${publication.editorialEmail}`}>{publication.editorialEmail}</a></p>
				<p><Link href="/politica-editoriala/">Politica editorială</Link> · <Link href="/politica-corecturi/">Politica de corecturi</Link></p>
			</div></main>
			<FooterOne />
		</>
	);
}
