import Image from "next/image";
import { getAllPosts } from "../../../lib/postsList.js";
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";
import PostLayoutTwo from "../../components/post/layout/PostLayoutTwo";
import WidgetAd from "../../components/widget/WidgetAd";
import WidgetCategory from "../../components/widget/WidgetCategory";
import WidgetPost from "../../components/widget/WidgetPost";
import WidgetSocialShare from "../../components/widget/WidgetSocialShare";
import { slugify } from "../../utils";
import { isRecomandarePost } from "../../../lib/recomandarePosts";

const PostAuthor = ({ postData, allPosts }) => {
	const authorContent = postData[0];

	return (
		<>
			<HeadMeta metaTitle={authorContent.author_name} metaDesc={`Vezi toate articolele publicate de ${authorContent.author_name}.`} />
			<HeaderOne />
			<Breadcrumb aPage={authorContent.author_name} />
			<div className="banner banner__default bg-grey-light-three">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-12">
							<div className="author-details-block">
								<div className="media post-block post-block__mid m-b-xs-0">
									<div className="align-self-center">
										<Image
											src={authorContent.author_img}
											alt={authorContent.author_name}
											width={210}
											height={210}
											className="m-r-xs-30"
										/>
										<div className="grad-overlay__transparent overlay-over" />
									</div>
									<div className="media-body">
										<h2 className="h4 m-b-xs-15">{authorContent.author_name}</h2>
										<p className="mid">{authorContent.author_bio}</p>
										<div className="post-metas">
											<ul className="list-inline">
												<li><span className="author-article-count"><i className="fal fa-user-edit" />Articole scrise ({postData.length})</span></li>
											</ul>
										</div>
									</div>
								</div>
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
								<h2 className="h3 m-b-xs-40">Articolele autorului</h2>
								{postData.map((data) => (
									<PostLayoutTwo data={data} postSizeMd={true} key={data.slug} />
								))}
							</div>
						</div>
						<div className="col-lg-4">
							<div className="post-sidebar">
								<WidgetAd />
								<WidgetSocialShare />
								<WidgetCategory cateData={allPosts} />
								<WidgetPost dataPost={allPosts} />
								<WidgetAd img="/images/posts/lab_ad.webp" height={492} width={320} link="https://laboratoruldeseo.ro" />
							</div>
						</div>
					</div>
				</div>
			</div>
			<FooterOne />
		</>
	);
}

export default PostAuthor;

export async function getServerSideProps({ params }) {

	const postParams = params.slug;

	const allPosts = await getAllPosts([
		'slug',
		'cate',
		'cate_img',
		'title',
		'excerpt',
		'featureImg',
		'date',
		'author_name',
		'author_img',
		'author_social',
		'author_bio',
		'featureImgSrc',
		'tags'
	]);

	const getAuthorData = allPosts.filter(post => !isRecomandarePost(post) && slugify(post.author_name) === postParams).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 100);;
	const postData = getAuthorData;

	return {
		props: {
			postData,
			allPosts
		},	}
}

