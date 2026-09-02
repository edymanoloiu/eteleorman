import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";
import { getPostImageSrc } from "../../../lib/postImage";
import { getPostHref } from "../../../lib/postHref";

const formatDate = (date) => {
	try {
		return new Date(date).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
	} catch {
		return "";
	}
};

function resolveItemHref(data) {
	const link = data?.link != null ? String(data.link).trim() : "";
	if (link) return link;
	return getPostHref(data);
}

function ItemLink({ href, className, children }) {
	if (!href) return <span className={className}>{children}</span>;
	if (/^https?:\/\//i.test(href)) {
		return (
			<a href={href} className={className} target="_blank" rel="noopener noreferrer">
				{children}
			</a>
		);
	}
	return (
		<Link href={href} className={className}>
			{children}
		</Link>
	);
}

const SoledadImportedList = ({ items }) => {
	if (!items?.length) return null;

	return (
		<div>
			{items.map((data, index) => {
				const href = resolveItemHref(data);
				if (!href) return null;
				const imageUrl = getPostImageSrc(data);

				return (
					<div className="soledad-list-item" key={data?.slug || data?.guid || data?.link || index}>
						<ItemLink href={href} className="soledad-list-item__thumb">
							<ImageWithFallback
								src={imageUrl}
								alt={data.title}
								width={120}
								height={90}
								unoptimized
							/>
						</ItemLink>
						<div>
							<h4 className="soledad-list-item__title">
								<ItemLink href={href}>{data.title}</ItemLink>
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
