import Link from "next/link";
import { getPostHref } from "../../../lib/postHref";

const WeboratoryBreakingTicker = ({ posts }) => {
	const items = (posts || []).slice(0, 8);
	if (!items.length) return null;

	return (
		<div className="weboratory-breaking-ticker" aria-label="Știri de ultimă oră">
			<span className="weboratory-breaking-ticker__label">Breaking</span>
			<div className="weboratory-breaking-ticker__track">
				<div className="weboratory-breaking-ticker__content">
					{items.map((post) => (
						<Link
							key={post.slug}
							href={post.link || getPostHref(post)}
							className="weboratory-breaking-ticker__item"
						>
							{post.title}
						</Link>
					))}
					{items.map((post) => (
						<Link
							key={`dup-${post.slug}`}
							href={post.link || getPostHref(post)}
							className="weboratory-breaking-ticker__item"
							aria-hidden="true"
						>
							{post.title}
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default WeboratoryBreakingTicker;
