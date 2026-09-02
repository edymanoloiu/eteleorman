import Link from "next/link";
import HubPage from "../components/local-knowledge/HubPage";
import publication from "../data/publication";
import { loadPublishedEvergreen } from "../../lib/local-knowledge/contentLoader";
import { getContentTypeMeta } from "../../lib/local-knowledge/contentTypes";
import { getAllPosts } from "../../lib/api";
import { getPostHref } from "../../lib/articleRoutes";

const TITLE = "Educație";
const PATH = "/educatie/";
const TOPIC = "educatie";

export default function TopicHub({ items }) {
	const description = `Informații locale despre educație în {city}.`.replace("{city}", publication.city);
	return (
		<HubPage
			title={TITLE}
			description={description}
			pathname={PATH}
			items={items}
			emptyMessage="Conținutul pentru această temă este în curs de construire. Între timp, consultați știrile locale și ghidul orașului."
			intro={
				<p>
					<Link href={`/categorie/${publication.categorySlug}/`}>Ultimele știri din {publication.city}</Link>
					{" · "}
					<Link href="/ghidul-orasului/">Ghidul orașului</Link>
				</p>
			}
		/>
	);
}

export async function getServerSideProps() {
	const evergreen = loadPublishedEvergreen().filter((d) =>
		d.primaryTopic === TOPIC ||
		(d.secondaryTopics || []).includes(TOPIC) ||
		(d.tags || []).some((t) => String(t).toLowerCase().includes(TOPIC.split("-")[0]))
	);
	const items = evergreen.map((d) => {
		const meta = getContentTypeMeta(d.contentType);
		return {
			slug: d.slug,
			title: d.title,
			description: d.description,
			category: d.category,
			typeLabel: meta?.labelRo,
			href: `/${meta.routePrefix}/${d.slug}/`,
		};
	});

	// Adaugă câteva știri recente doar ca linkuri, fără a crea arhive goale
	if (items.length < 3) {
		const posts = await getAllPosts(["slug", "title", "excerpt", "cate", "date", "tags"]);
		const news = posts
			.filter((p) => (p.tags || []).join(" ").toLowerCase().includes(TOPIC.split("-")[0]) || (p.title || "").toLowerCase().includes(TOPIC.split("-")[0]))
			.slice(0, 8)
			.map((p) => ({
				slug: p.slug,
				title: p.title,
				description: p.excerpt || "",
				category: p.cate,
				typeLabel: "Știre",
				href: getPostHref(p),
			}));
		items.push(...news);
	}

	return { props: { items } };
}
