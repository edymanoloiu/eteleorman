import HubPage from "../../components/local-knowledge/HubPage";
import publication from "../../data/publication";
import { getHubItems } from "../../../lib/local-knowledge/getDocumentPageProps";

const TITLE = "Explicații";
const PATH = "/explicatii/";

export default function Hub({ items }) {
	const description = `Materiale explicative despre subiecte locale din {city}.`.replace("{city}", publication.city);
	return (
		<HubPage
			title={TITLE}
			description={description}
			pathname={PATH}
			items={items}
		/>
	);
}

export async function getServerSideProps() {
	const items = await getHubItems("explainer");
	return { props: { items } };
}
