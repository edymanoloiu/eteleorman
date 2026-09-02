import Link from "next/link";
import { getAllPosts } from "../../../lib/api";
import { isRecomandarePost } from "../../../lib/recomandarePosts";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";
import Breadcrumb from "../../components/common/Breadcrumb";
import { slugify } from "../../utils";
import HeadMeta from "../../components/elements/HeadMeta";
import WidgetAd from "../../components/widget/WidgetAd";
import WidgetPost from "../../components/widget/WidgetPost";
import PostLayoutTwo from "../../components/post/layout/PostLayoutTwo";
import publication from "../../data/publication";
import { getCanonicalUrl } from "../../../lib/local-knowledge/seo";

const PER_PAGE = 24;

const PostCategory = ({ postData, allPosts, categoryName, page, totalPages, categorySlug }) => {
	const site = publication.canonicalDomain.replace(/\/$/, '');
	const canonical =
		page > 1
			? `${site}/categorie/${categorySlug}/?page=${page}`
			: getCanonicalUrl(`/categorie/${categorySlug}/`);

	return (
		<>
			<HeadMeta
				metaTitle={categoryName || "Știri"}
				metaDesc={`Cele mai noi articole din categoria ${categoryName || "Știri"}${page > 1 ? ` — pagina ${page}` : ''}.`}
				canonicalUrl={canonical}
				ogUrl={canonical}
			/>
			<HeaderOne />
			<Breadcrumb aPage={categoryName} />
			<div className="banner banner__default bg-grey-light-three">
				<div className="container">
					<div className="row align-items-center">
						<div className="col-lg-12">
							<div className="post-title-wrapper">
								<h1 className="m-b-xs-0 axil-post-title hover-line">{categoryName}</h1>
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
								{postData.map((data) => (
									<PostLayoutTwo data={data} postSizeMd={true} key={data.slug} />
								))}
							</div>
							{totalPages > 1 ? (
								<nav className="m-t-xs-40" aria-label="Paginare categorie">
									<ul className="pagination">
										{page > 1 ? (
											<li className="page-item">
												<Link
													className="page-link"
													href={page === 2 ? `/categorie/${categorySlug}/` : `/categorie/${categorySlug}/?page=${page - 1}`}
													rel="prev"
												>
													Anterior
												</Link>
											</li>
										) : null}
										<li className="page-item disabled">
											<span className="page-link">
												Pagina {page} din {totalPages}
											</span>
										</li>
										{page < totalPages ? (
											<li className="page-item">
												<Link
													className="page-link"
													href={`/categorie/${categorySlug}/?page=${page + 1}`}
													rel="next"
												>
													Următor
												</Link>
											</li>
										) : null}
									</ul>
								</nav>
							) : null}
						</div>
						<div className="col-lg-4">
							<div className="post-sidebar">
								<WidgetAd />
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
};

export default PostCategory;

export async function getServerSideProps({ params, query }) {
	const postParams = params.slug;
	const pageRaw = Number.parseInt(String(query.page || '1'), 10);
	const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;

	const allPosts = getAllPosts([
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
		'featureImgSrc',
		'tags',
	]);

	const getCategoryData = allPosts
		.filter((post) => !isRecomandarePost(post) && post.cate && slugify(post.cate.toLowerCase()) === postParams)
		.sort((a, b) => new Date(b.date) - new Date(a.date));

	if (!getCategoryData.length) {
		return { notFound: true };
	}

	const totalPages = Math.max(1, Math.ceil(getCategoryData.length / PER_PAGE));
	if (page > totalPages) {
		return { notFound: true };
	}

	const start = (page - 1) * PER_PAGE;
	const postData = getCategoryData.slice(start, start + PER_PAGE);
	const categoryName = getCategoryData[0].cate;

	return {
		props: {
			postData,
			allPosts: allPosts.slice(0, 20),
			categoryName,
			page,
			totalPages,
			categorySlug: postParams,
			siteName: publication.publicationName,
		},
	};
}
