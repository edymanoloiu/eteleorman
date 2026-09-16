import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";
import { getPostImageSrc } from "../../../lib/postImage";
import { getPostHref } from "../../../lib/postHref";


const EXCERPT_LIMIT = 200;

const getExcerpt = (data) => {
	const raw =
		data?.contentSnippet ||
		data?.summary ||
		data?.description ||
		data?.content ||
		data?.["content:encoded"] ||
		data?.excerpt ||
		"";
	const plain = String(raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
	if (!plain) return "";
	if (plain.length <= EXCERPT_LIMIT) return plain;
	return `${plain.slice(0, EXCERPT_LIMIT).trimEnd()}...`;
};


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
				const excerpt = getExcerpt(data);

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
							{excerpt ? <p className="soledad-list-item__excerpt">{excerpt}</p> : null}
							<span className="soledad-post-card__date">{formatDate(data.isoDate)}</span>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default SoledadImportedList;
