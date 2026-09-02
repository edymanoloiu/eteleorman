import HubPage from "../../components/local-knowledge/HubPage";
import publication from "../../data/publication";
import { getHubItems } from "../../../lib/local-knowledge/getDocumentPageProps";

const TITLE = "Ghidul orașului";
const PATH = "/ghidul-orasului/";

export default function Hub({ items }) {
	const description = `Ghiduri practice și informații utile pentru locuitorii din {city}.`.replace("{city}", publication.city);
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
	const items = await getHubItems("guide");
	return { props: { items } };
}
