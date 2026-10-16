import Link from "next/link";
import ImageWithFallback from "../common/ImageWithFallback";
import { getPostImageSrc } from "../../../lib/postImage";
import { getPostHref } from "../../../lib/postHref";
import { slugify } from "../../utils";

const formatDate = (date) => {
	try {
		return new Date(date).toLocaleDateString("ro-RO", {
			day: "numeric",
			month: "long",
			year: "numeric",
		});
	} catch {
		return "";
	}
};

const WeboratoryPostCard = ({ data, variant = "grid" }) => {
	const href = data.link || getPostHref(data);
	const img = getPostImageSrc(data);
	const excerpt = data.excerpt ? `${data.excerpt.substring(0, 120)}...` : "";

	if (variant === "featured") {
		return (
			<Link href={href} className="weboratory-featured-card">
				<ImageWithFallback src={img} alt={data.title} fill sizes="(max-width:768px) 50vw, 25vw" unoptimized />
				<div className="weboratory-featured-card__overlay">
					<span className="weboratory-featured-card__cat">{data.cate || data.creator || "Știri"}</span>
					<h3 className="weboratory-featured-card__title">{data.title}</h3>
					<span className="weboratory-featured-card__meta">{formatDate(data.date || data.isoDate)}</span>
				</div>
			</Link>
		);
	}

	if (variant === "hero") {
		return (
			<Link href={href} className="weboratory-hero-card">
				<ImageWithFallback
					src={img}
					alt={data.title}
					fill
					sizes="(max-width:768px) 100vw, 50vw"
					unoptimized
					style={{ objectFit: "cover" }}
				/>
				<div className="weboratory-hero-card__overlay">
					<span className="weboratory-featured-card__cat">{data.cate || "Știri"}</span>
					<h2 className="weboratory-hero-card__title">{data.title}</h2>
					{excerpt && <p className="weboratory-hero-card__excerpt">{excerpt}</p>}
					<span className="weboratory-featured-card__meta">{formatDate(data.date)}</span>
				</div>
			</Link>
		);
	}

	if (variant === "compact") {
		return (
			<Link href={href} className="bn2-compact-card">
				<span className="bn2-compact-card__thumb">
					<ImageWithFallback
						src={img}
						alt=""
						width={90}
						height={68}
						unoptimized
						style={{ objectFit: "cover", width: "100%", height: "100%" }}
					/>
				</span>
				<span className="bn2-compact-card__body">
					<span className="bn2-compact-card__title">{data.title}</span>
					<span className="bn2-compact-card__date">{formatDate(data.date || data.isoDate)}</span>
				</span>
			</Link>
		);
	}

	if (variant === "trending") {
		return (
			<Link href={href} className="weboratory-trending-card">
				<ImageWithFallback src={img} alt={data.title} fill sizes="(max-width:768px) 100vw, 33vw" unoptimized />
				<div className="weboratory-trending-card__overlay">
					<h4>{data.title}</h4>
					<span className="weboratory-featured-card__meta">{formatDate(data.date || data.isoDate)}</span>
				</div>
			</Link>
		);
	}

	return (
		<article className="weboratory-post-card">
			<Link href={href} className="weboratory-post-card__img">
				<ImageWithFallback src={img} alt={data.title} fill sizes="(max-width:768px) 100vw, 50vw" unoptimized />
			</Link>
			<div className="weboratory-post-card__body">
				{data.cate && (
					<Link href={`/categorie/${slugify(data.cate)}`} className="weboratory-post-card__cat">
						{data.cate}
					</Link>
				)}
				<h3 className="weboratory-post-card__title">
					<Link href={href}>{data.title}</Link>
				</h3>
				{excerpt && <p className="weboratory-post-card__excerpt">{excerpt}</p>}
				<span className="weboratory-post-card__date">{formatDate(data.date)}</span>
			</div>
		</article>
	);
};

export default WeboratoryPostCard;
