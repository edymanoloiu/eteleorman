import HubPage from "../../components/local-knowledge/HubPage";
import publication from "../../data/publication";
import { getHubItems } from "../../../lib/local-knowledge/getDocumentPageProps";

const TITLE = "Instituții";
const PATH = "/institutii/";

export default function Hub({ items }) {
	const description = `Instituții publice și administrație locală în {city}.`.replace("{city}", publication.city);
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
	const items = await getHubItems("institution");
	return { props: { items } };
}
