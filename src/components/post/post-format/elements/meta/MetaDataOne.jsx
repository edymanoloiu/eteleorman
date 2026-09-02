import Link from "next/link";
import ImageWithFallback from "../../../../common/ImageWithFallback";
import { LOCAL_AVATAR_FALLBACK } from "../../../../../../lib/imageFallback";
import { slugify } from "../../../../../utils";

const MetaDataOne = ({ metaData }) => {
	return (
		<div className="banner banner__single-post banner__standard">
			<div className="container">
				<div className="row align-items-center">
					<div className="col-lg-6">
						<div className="post-title-wrapper">
							<div className="btn-group">
								<Link
									href={`/categorie/${slugify(metaData.cate)}`}
									className={`cat-btn ${metaData.cate_bg ?? "bg-color-blue-one"}`}
								>
									{metaData.cate}
								</Link>
							</div>
							<h2 className="m-t-xs-20 m-b-xs-0 axil-post-title hover-line">{metaData.title}</h2>
							<div className="post-metas banner-post-metas m-t-xs-20">
								<ul className="list-inline">
									<li>
										<Link
											href={`/autor/${slugify(metaData.author_name)}`}
											className="post-author post-author-with-img"
										>
											<ImageWithFallback
												src={metaData.author_img}
												fallbackSrc={LOCAL_AVATAR_FALLBACK}
												alt={metaData.author_name}
												width={30}
												height={30}
											/>
											<span className="author-name">{metaData.author_name}</span>
										</Link>
									</li>
									<li>
										<i className="feather icon-activity" />
										{metaData.post_views}
									</li>
									<li>
										<i className="feather icon-share-2" />
										{metaData.post_share}
									</li>
									<li>
										<i className="feather icon-calendar" />
										{new Date(metaData.date).toLocaleDateString()}
									</li>
									{metaData.featureImgSrc &&
										<li>
											Sursa poza: {metaData.featureImgSrc}
										</li>
									}
								</ul>
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="post-main-thumbnail">
							<ImageWithFallback
								src={metaData.featureImg}
								alt={metaData.title}
								width={540}
								height={540}
								className="img-fluid"
								unoptimized
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MetaDataOne;
