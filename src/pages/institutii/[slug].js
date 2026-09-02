import DocumentPage from "../../components/local-knowledge/DocumentPage";
import { getDocumentPageProps } from "../../../lib/local-knowledge/getDocumentPageProps";
import { listEvergreenSlugs } from "../../../lib/local-knowledge/contentLoader";

export default function Page(props) {
	return <DocumentPage {...props} />;
}

export async function getServerSideProps(ctx) {
	return getDocumentPageProps("institution", ctx.params);
}
