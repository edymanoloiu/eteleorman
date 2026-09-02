import Link from "next/link";
import ImageWithFallback from "../../../common/ImageWithFallback";
import { LOCAL_AVATAR_FALLBACK } from "../../../../../lib/imageFallback";
import { slugify } from "../../../../utils";

const PostAuthor = ({ authorData }) => {
	return (
		<div className="about-author m-b-xs-60">
			<div className="media">
				<Link href={`/autor/${slugify(authorData.author_name)}`}>
					<ImageWithFallback
						src={authorData.author_img}
						fallbackSrc={LOCAL_AVATAR_FALLBACK}
						alt={authorData.author_name}
						height={105}
						width={105}
						className="author-img"
					/>
				</Link>
				<div className="media-body">
					<div className="media-body-title">
						<h3>
							<Link href={`/autor/${slugify(authorData.author_name)}`}>
								{authorData.author_name}
							</Link>
						</h3>
					</div>
					<div className="media-body-content">
						<p>{authorData.author_bio}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostAuthor;
