import Image from "next/image";
import Link from "next/link";
import ImageWithFallback from "../../common/ImageWithFallback";
import { getPostHref } from "../../../../lib/postHref";
import { slugify } from "../../../utils";

const PostVideoTwo = ({ data, pClass, videoIcon }) => {
	return (
		<div className={`media post-block post-block__small ${pClass ?? "post-block__on-dark-bg m-b-xs-30"}`}>
			<Link href={getPostHref(data)} className="align-self-center">
				
					<Image
						src={data.featureImg}
						unoptimized						alt={data.title}
						width={100}
						height={100}
					/>
					{videoIcon === true ? <span className="video-play-btn video-play-btn__small" /> : ""}
				
			</Link>

			<div className="media-body">
				<div className="post-cat-group">
					<Link href={`/categorie/${slugify(data.cate)}`} className={`post-cat ${data.cate_bg ?? "bg-color-blue-one"}`}>
						{data.cate}
					</Link>
				</div>
				<h3 className="axil-post-title hover-line hover-line">
					<Link href={getPostHref(data)}>
						{data.title}
					</Link>
				</h3>
				<div className="post-metas">
					<ul className="list-inline">
						<li>
							<span>De la</span>
							<Link href={`/autor/${slugify(data.author_name)}`} className="post-author">
								{data.author_name}
							</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default PostVideoTwo;
