import { getAllPosts } from "../../../lib/api";
import { isRecomandarePost } from "../../../lib/recomandarePosts";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import WidgetAd from "../../components/widget/WidgetAd";
import WidgetPost from "../../components/widget/WidgetPost";
import PostLayoutTwo from "../../components/post/layout/PostLayoutTwo";

const PAGE_TITLE = "Recomandări";
import publication from "../../data/publication";

const RecomandareIndex = ({ postData, allPosts }) => {
	const metaDesc =
		"Articole recomandate și recomandări parteneri pe eteleorman.ro — conținut editorial selectat.";
	return (
		<>
			<HeadMeta
				metaTitle={PAGE_TITLE}
				metaDesc={metaDesc}
				ogUrl={`${publication.canonicalDomain.replace(/\/$/, "")}/recomandare/`}
			/>
			<HeaderOne />
			<Breadcrumb aPage={PAGE_TITLE} />
			<div className="banner banner__default bg-grey-light-three">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-12">
							<div className="post-title-wrapper">
								<h1 className="m-b-xs-0 axil-post-title hover-line">{PAGE_TITLE}</h1>
								<p className="mid m-t-xs-10 m-b-xs-0">
									Articole marcate ca recomandare sau recomandare partener.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="random-posts section-gap">
				<div className="container">
					<div className="row">
						<div className="col-lg-8">
							<div className="axil-content">
								{postData.length === 0 ? (
									<p className="mid">Momentan nu există articole în această secțiune.</p>
								) : (
									postData
										.sort((a, b) => new Date(b.date) - new Date(a.date))
										.map((data) => (
											<PostLayoutTwo data={data} postSizeMd={true} key={data.slug} />
										))
								)}
							</div>
						</div>
						<div className="col-lg-4">
							<div className="post-sidebar">
								<WidgetAd />
								<WidgetPost dataPost={allPosts} />
								<WidgetAd
									img="/images/posts/lab_ad.webp"
									height={492}
									width={320}
									link="https://laboratoruldeseo.ro"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<FooterOne />
		</>
	);
};

export default RecomandareIndex;

export async function getServerSideProps() {
	const allPostsRaw = await getAllPosts([
		"slug", "cate", "cate_img", "cate_bg", "title", "excerpt", "featureImg", "date", "post_views",
		"read_time", "author_name", "author_social", "trending", "featureImgSrc", "tags",
	]);
	const postData = allPostsRaw.filter((post) => isRecomandarePost(post)).sort((a, b) => new Date(b.date) - new Date(a.date));
	const allPosts = allPostsRaw.filter((post) => !isRecomandarePost(post));
	return { props: { postData, allPosts } };
}
