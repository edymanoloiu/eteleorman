import Image from "next/image";
import Link from "next/link";
import ImageWithFallback from "../../common/ImageWithFallback";
import { getPostHref } from "../../../../lib/postHref";
import { slugify } from "../../../utils";

const PostLayoutTwo = ({ data, postSizeMd, postBgDark, imported }) => {
	let img = data.content?.substring(data.content?.indexOf('src="') + 5);
	img = img?.substring(0, img?.indexOf('"'));
	const importedContent = (data?.content || data?.["content:encoded"] || data?.summary || data?.description || "").replace(/<[^>]+>/g, "");
	const importedExcerpt = importedContent ? `${importedContent.substring(0, 100)}...` : "";
	const standardExcerpt = data?.excerpt ? `${data.excerpt.substring(0, 400)}...` : "";
	const getImportedImage = () => {
		const enclosure = data?.enclosure?.url;
		if (enclosure) return enclosure;

		const encoded = data?.["content:encoded"] || data?.content;
		if (encoded) {
			const match = encoded.match(/<img[^>]+src="([^">]+)"/i);
			if (match?.[1]) return match[1];
		}
		return null;
	};
	const buildImportedImageUrl = (imageUrl) => {
		if (!imageUrl) return null;

		try {
			// Already an absolute URL
			return new URL(imageUrl).toString();
		} catch (error) {
			// imageUrl is likely relative, fall through to try building from the article domain
		}

		if (!data?.link) return null;

		try {
			const base = new URL(data.link).origin;
			return new URL(imageUrl, base).toString();
		} catch (error) {
			return null;
		}
	};

	let importedImage = imported ? buildImportedImageUrl(getImportedImage()) : null;

	let catBg = 'bg-color-purple-one';

	if (data.categories?.length > 0) {
		if (data.categories[0] === 'Auto') {
			catBg = 'bg-color-blue-one';
		} else if (data.categories[0] === 'Interior design') {
			catBg = 'bg-color-red-two';
		} else if (data.categories[0] === 'Travel') {
			catBg = 'bg-color-green-one';
		} else if (data.categories[0] === 'Politic') {
			catBg = 'bg-color-yellow-one';
		} else if (data.categories[0] === 'Showbiz') {
			catBg = 'bg-color-blue-grey-one';
		}
	}

	return (
		!imported ?
			<div className={`media post-block m-b-xs-30 ${postSizeMd === true ? "post-block__mid" : ""} ${postBgDark === true ? "post-block__on-dark-bg" : ""}`}>
				<Link href={getPostHref(data)} className="align-self-center">
					<ImageWithFallback
						src={data.featureImg}
						alt={data.title}
						width={postSizeMd === true ? 285 : 150}
						height={postSizeMd === true ? 285 : 150}
						placeholder="blur"
						blurDataURL="/images/placeholder.png"
						unoptimized
					/>
				</Link>
				<div className="media-body">
					<div className="post-cat-group m-b-xs-10">
						<Link href={`/categorie/${slugify(data.cate)}`} className={`post-cat cat-btn ${data.cate_bg ?? "bg-color-blue-one"}`}>
							{data.cate}
						</Link>
					</div>
					<h3 className="axil-post-title hover-line hover-line">
						<Link href={`/post/${data.slug}`}>
							{data.title}
						</Link>
					</h3>
					{postSizeMd === true && standardExcerpt &&
						<p className="mid">{standardExcerpt}</p>
					}
					<div className="post-metas">
						<ul className="list-inline">
							<li>
								<span>De la</span>
								<Link href={`/autor/${slugify(data.author_name)}`} className="post-author">
									{data.author_name}
								</Link>
							</li>
							<li>
								<i className="dot">.</i>{new Date(data.date).toLocaleDateString()}
							</li>
							{data.featureImgSrc &&
								<li>
									<i className="dot">.</i>Sursa imagine: {data.featureImgSrc}
								</li>
							}
						</ul>
					</div>
				</div>
			</div> :
			<div className={`media post-block m-b-xs-30 ${postSizeMd === true ? "post-block__mid" : ""} ${postBgDark === true ? "post-block__on-dark-bg" : ""}`}>
				<Link href={data.link} className="align-self-center">
					<Image
						src={importedImage ? `${importedImage}${importedImage.includes('?') ? '&' : '?'}auto=compress&cs=tinysrgb&h=350` : '/images/cropped_image.png'}
						alt={data.title}
						width={postSizeMd === true ? 285 : 150}
						height={postSizeMd === true ? 285 : 150}
						unoptimized
						placeholder="blur"
						blurDataURL="/images/placeholder.png"
					/>
				</Link>
				<div className="media-body">
					<div className="post-cat-group m-b-xs-10">
						<div className={`post-cat cat-btn ${catBg ?? "bg-color-blue-one"}`}>
							{data.creator || 'Partener'}
						</div>
					</div>
					<h3 className="axil-post-title hover-line hover-line">
						<Link href={data.link}>
							{data.title}
						</Link>
					</h3>
					{importedExcerpt && <p className="mid">{importedExcerpt}</p>}
					<div className="post-metas">
						<ul className="list-inline">
							<li>
								{new Date(data.isoDate).toLocaleDateString()}
							</li>
						</ul>
					</div>
				</div>
			</div>
	);
};

export default PostLayoutTwo;
