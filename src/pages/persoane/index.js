import HubPage from "../../components/local-knowledge/HubPage";
import publication from "../../data/publication";
import { getHubItems } from "../../../lib/local-knowledge/getDocumentPageProps";

const TITLE = "Persoane";
const PATH = "/persoane/";

export default function Hub({ items }) {
	const description = `Persoane publice relevante pentru {city}.`.replace("{city}", publication.city);
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
	const items = await getHubItems("person");
	return { props: { items } };
}
