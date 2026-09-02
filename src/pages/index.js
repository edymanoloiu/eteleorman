import Parser from 'rss-parser';
import { getAllPosts } from "../../lib/api";
import { isRecomandarePost, dedupePostsBySlug } from "../../lib/recomandarePosts";
import { buildLocalPostsWithPromos } from "../../lib/homepagePosts";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";
import SoledadNewsHub from "../components/soledad/SoledadNewsHub";
import publication from "../data/publication";
import site from "../data/soledadSite";

const HomeOne = ({ allPosts, sitemaps }) => {
	const uniquePosts = dedupePostsBySlug(allPosts);
	const localPosts = buildLocalPostsWithPromos(uniquePosts, site.localCate);

	const culturePosts = uniquePosts
		.filter((a) => a.cate === "Evenimente si cultura")
		.sort((a, b) => new Date(b.date) - new Date(a.date));
	const nationalPosts = sitemaps?.pc ?? [];

	return (
		<>
			<HeadMeta
				fullPageTitle={publication.seo.title}
				metaDesc={publication.seo.description}
				ogTitle={publication.seo.openGraph.title}
				ogDescription={publication.seo.openGraph.description}
				twitterTitle={publication.seo.twitter.title}
				twitterDescription={publication.seo.twitter.description}
			/>
			<HeaderOne />
			<SoledadNewsHub
				localPosts={localPosts}
				culturePosts={culturePosts}
				nationalPosts={nationalPosts}
				sitemaps={sitemaps}
			/>
			<FooterOne />
		</>
	);
};

export default HomeOne;

export async function getServerSideProps() {
	const parser = new Parser({ timeout: 2000 });

	const posts = getAllPosts([
		"postFormat",
		"trending",
		"story",
		"slug",
		"title",
		"excerpt",
		"featureImg",
		"cate",
		"cate_bg",
		"cate_img",
		"author_name",
		"date",
		"post_views",
		"post_share",
		"featureImgSrc",
		"thumb",
		"isPromo",
		"topPost",
		"tags",
	])
		.filter((post) => !isRecomandarePost(post))
		.sort((a, b) => new Date(b.date) - new Date(a.date));
	const allPosts = [
		...posts.filter((a) => a.cate === 'Evenimente si cultura').slice(0, 30),
		...posts.filter((a) => a.cate === site.localCate).slice(0, 30),
		...posts.filter((a) => a.cate === 'Stiri nationale si internationale').slice(0, 30),
		...posts.filter((a) => a.isPromo).slice(0, 30),
	];

	const weboSitemaps = await Promise.allSettled([
		parser.parseURL("https://obliqdesign.ro/rss.xml"),
		parser.parseURL("https://meritasamergi.ro/rss.xml"),
		parser.parseURL("https://ghidullegal.ro/rss.xml"),
		parser.parseURL("https://sfaturidesanatate.ro/rss.xml"),
		parser.parseURL("https://ghidulgospodarului.ro/rss.xml"),
		parser.parseURL("https://azicemancam.ro/rss.xml"),
		parser.parseURL("https://cautimasina.ro/rss.xml"),
		parser.parseURL("https://painesicirc.ro/rss.xml"),
	]);

	return {
		props: {
			allPosts,
			sitemaps: {
				obliq: weboSitemaps[0]?.value?.items?.slice(0, 6) || [],
				mm: weboSitemaps[1]?.value?.items?.slice(0, 6) || [],
				legal: weboSitemaps[2]?.value?.items?.slice(0, 6) || [],
				sanatate: weboSitemaps[3]?.value?.items?.slice(0, 6) || [],
				gospodar: weboSitemaps[4]?.value?.items?.slice(0, 6) || [],
				azi: weboSitemaps[5]?.value?.items?.slice(0, 6) || [],
				cm: weboSitemaps[6]?.value?.items?.slice(0, 6) || [],
				pc: weboSitemaps[7]?.value?.items?.slice(0, 10) || [],
			},
		},
	};
}
