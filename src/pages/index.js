import { getAllPosts } from "../../lib/api";
import { fetchPartnerSitemaps } from "../../lib/partnerRssFeeds";
import { isRecomandarePost, dedupePostsBySlug } from "../../lib/recomandarePosts";
import { buildLocalPostsWithPromos, sortPostsByDate } from "../../lib/homepagePosts";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";
import WeboratoryNewsHub from "../components/weboratory/WeboratoryNewsHub";
import publication from "../data/publication";
import site from "../data/weboratorySite";

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
			<WeboratoryNewsHub
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



export async function getServerSideProps({ res }) {
	if (res) {
		res.setHeader(
			"Cache-Control",
			"public, s-maxage=300, stale-while-revalidate=86400",
		);
		res.setHeader(
			"CDN-Cache-Control",
			"public, s-maxage=300, stale-while-revalidate=86400",
		);
	}


	const posts = (await getAllPosts([
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
	]))
		.filter((post) => !isRecomandarePost(post))

	const takeLatest = (predicate, limit = 30) =>
		sortPostsByDate(posts.filter(predicate)).slice(0, limit);

	const allPosts = [
		...takeLatest((a) => a.cate === 'Evenimente si cultura'),
		...takeLatest((a) => a.cate === site.localCate),
		...takeLatest((a) => a.cate === 'Stiri nationale si internationale'),
		...takeLatest((a) => a.isPromo),
	];

	const sitemaps = await fetchPartnerSitemaps();
return {
		props: {
			allPosts,
			sitemaps,
		},
	};
}
