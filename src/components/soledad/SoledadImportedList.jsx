import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";
import { getPostImageSrc } from "../../../lib/postImage";

const formatDate = (date) => {
	try {
		return new Date(date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
	} catch {
		return "";
	}
};

const SoledadImportedList = ({ items }) => {
	if (!items?.length) return null;

	return (
		<div>
			{items.map((data, index) => {
				const imageUrl = getPostImageSrc(data);

				return (
					<div className="soledad-list-item" key={data?.slug || data?.guid || data?.link || index}>
						<Link href={data.link} className="soledad-list-item__thumb">
							<ImageWithFallback
								src={imageUrl}
								alt={data.title}
								width={120}
								height={90}
								unoptimized
							/>
						</Link>
						<div>
							<h4 className="soledad-list-item__title">
								<Link href={data.link}>{data.title}</Link>
							</h4>
							<p className="soledad-list-item__excerpt">
								{(data.summary || data.description || "").replace(/<[^>]+>/g, "").substring(0, 140)}...
							</p>
							<span className="soledad-post-card__date">{formatDate(data.isoDate)}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SoledadImportedList;
