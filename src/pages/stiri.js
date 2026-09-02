import { getAllPosts } from "../../lib/api";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";
import HeadMeta from "../components/elements/HeadMeta";
import WidgetAd from "../components/widget/WidgetAd";
import WidgetPost from "../components/widget/WidgetPost";
import PostLayoutTwo from "../components/post/layout/PostLayoutTwo";


const AllPosts = ({ allPosts }) => {
	return (
		<>
			<HeadMeta metaTitle="Toate știrile" metaDesc="Cele mai noi articole și actualizări publicate pe site." />
			<HeaderOne />
			{/* Banner Start here  */}
			<div className="banner banner__default bg-grey-light-three">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-12">
							<div className="post-title-wrapper">
								<h1 className="m-b-xs-0 axil-post-title hover-line">Toate știrile</h1>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* Banner End here  */}
			<div className="random-posts section-gap">
				<div className="container">
					<div className="row">
						<div className="col-lg-8">
							{/* <AdBanner /> */}
							<div className="axil-content">
								{allPosts.sort((a, b) => new Date(b.date) - new Date(a.date)).map((data) => (
									<PostLayoutTwo data={data} postSizeMd={true} key={data.slug} />
								))}
							</div>
						</div>
						<div className="col-lg-4">
							<div className="post-sidebar">
								<WidgetAd />
								{/* <WidgetSocialShare />
								<WidgetCategory cateData={allPosts} /> */}
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

export default AllPosts;


export async function getServerSideProps({ }) {

	const allPosts = (await getAllPosts([
		'slug',
		'cate',
		'cate_img',
		'title',
		'excerpt',
		'featureImg',
		'date',
		'post_views',
		'read_time',
		'author_name',
		'author_social',
		'trending',
		'featureImgSrc'
	]));

	const listedPosts = (Array.isArray(allPosts) ? allPosts : [])
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 150);

	return {
		props: {
			allPosts: listedPosts
		}
	}
}