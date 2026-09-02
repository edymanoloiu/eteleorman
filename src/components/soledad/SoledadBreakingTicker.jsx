import Link from "next/link";
import { getPostHref } from "../../../lib/postHref";

const SoledadBreakingTicker = ({ posts }) => {
	const items = (posts || []).slice(0, 8);
	if (!items.length) return null;

	return (
		<div className="soledad-breaking-ticker" aria-label="Știri de ultimă oră">
			<span className="soledad-breaking-ticker__label">Breaking</span>
			<div className="soledad-breaking-ticker__track">
				<div className="soledad-breaking-ticker__content">
					{items.map((post) => (
						<Link
							key={post.slug}
							href={post.link || getPostHref(post)}
							className="soledad-breaking-ticker__item"
						>
							{post.title}
						</Link>
					))}
					{items.map((post) => (
						<Link
							key={`dup-${post.slug}`}
							href={post.link || getPostHref(post)}
							className="soledad-breaking-ticker__item"
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

export default SoledadBreakingTicker;
