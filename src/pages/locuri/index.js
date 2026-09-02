import HubPage from "../../components/local-knowledge/HubPage";
import publication from "../../data/publication";
import { getHubItems } from "../../../lib/local-knowledge/getDocumentPageProps";

const TITLE = "Locuri";
const PATH = "/locuri/";

export default function Hub({ items }) {
	const description = `Locuri, atracții și spații publice din {city}.`.replace("{city}", publication.city);
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
	const items = await getHubItems("place");
	return { props: { items } };
}
