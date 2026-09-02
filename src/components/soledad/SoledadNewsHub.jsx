import Link from "next/link";
import { getPostHref } from "../../../lib/postHref";
import { normalizePartnerFeedItem } from "../../../lib/importedRssImage";
import {
	ensureActivePromosOnHomepage,
	getActivePromos,
	sortPostsByDate,
	takeUniquePosts,
} from "../../../lib/homepagePosts";
import site from "../../data/soledadSite";
import SoledadPostCard from "./SoledadPostCard";
import SoledadImportedList from "./SoledadImportedList";
import SoledadBreakingTicker from "./SoledadBreakingTicker";
import WidgetNewsletter from "../widget/WidgetNewsletter";
import SocialLink from "../../data/social/SocialLink.json";

const PARTNER_FEEDS = [
	{ key: "obliq", label: "Design", href: "https://obliqdesign.ro" },
	{ key: "mm", label: "Călătorii", href: "https://meritasamergi.ro" },
	{ key: "legal", label: "Legal", href: "https://ghidullegal.ro" },
	{ key: "sanatate", label: "Sănătate", href: "https://sfaturidesanatate.ro" },
	{ key: "gospodar", label: "Gospodărie", href: "https://ghidulgospodarului.ro" },
	{ key: "azi", label: "Bucătărie", href: "https://azicemancam.ro" },
	{ key: "cm", label: "Auto", href: "https://cautimasina.ro" },
];

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

const postHref = (post) => post.link || getPostHref(post);

const mapRss = (item) => normalizePartnerFeedItem(item);

const CategoryList = ({ title, href, items, external }) => {
	if (!items?.length) return null;
	const TitleTag = external ? "a" : Link;
	const titleProps = external
		? { href, target: "_blank", rel: "noopener noreferrer" }
		: { href };

	return (
		<div className="nh-cat-list">
			<h3 className="nh-cat-list__title">
				<TitleTag {...titleProps}>{title}</TitleTag>
			</h3>
			<ul>
				{items.map((post) => (
					<li key={post.slug || post.link || post.guid}>
						<Link href={postHref(post)} className="nh-cat-list__link">
							{post.title}
						</Link>
						<span className="nh-cat-list__date">{formatDate(post.date || post.isoDate)}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

const MagazineColumn = ({ title, href, featured, items, external }) => {
	if (!featured && !items?.length) return null;
	const TitleTag = external ? "a" : Link;
	const titleProps = external
		? { href, target: "_blank", rel: "noopener noreferrer" }
		: { href };

	return (
		<div className="nh-mag-col">
			<h3 className="nh-mag-col__title">
				<TitleTag {...titleProps}>{title}</TitleTag>
			</h3>
			{featured && (
				<div className="nh-mag-col__featured">
					<SoledadPostCard data={featured} variant="trending" />
				</div>
			)}
			<ul className="nh-mag-col__list">
				{(items || []).map((post) => (
					<li key={post.slug || post.link}>
						<Link href={postHref(post)}>{post.title}</Link>
						<span className="nh-mag-col__date">{formatDate(post.date || post.isoDate)}</span>
					</li>
				))}
			</ul>
		</div>
	);
};

const SoledadNewsHub = ({ localPosts, culturePosts, nationalPosts, sitemaps }) => {
	const seen = new Set();
	const dedupedLocal = localPosts.filter((p) => {
		if (seen.has(p.slug)) return false;
		seen.add(p.slug);
		return true;
	});
	const localCity = sortPostsByDate(
		dedupedLocal.filter((p) => p.cate === site.localCate || p.isPromo),
	);
	const evenimente = sortPostsByDate(
		culturePosts.filter((p) => p.cate === "Evenimente si cultura"),
	);
	const nationalFeed = (nationalPosts || []).map(mapRss);
	const activePromos = getActivePromos(localCity);
	const usedSlugs = new Set();
	const promoPriority = () => activePromos.filter((p) => !usedSlugs.has(p.slug));

	let topFour = takeUniquePosts(localCity, 4, usedSlugs, promoPriority());
	let spotlight = takeUniquePosts(localCity, 6, usedSlugs, promoPriority());
	let localLatest = takeUniquePosts(localCity, 6, usedSlugs, promoPriority());
	const eventsLatest = takeUniquePosts(evenimente, 6, usedSlugs);
	let videoPosts = takeUniquePosts(evenimente, 4, usedSlugs);
	if (!videoPosts.length) {
		videoPosts = takeUniquePosts(localCity, 4, usedSlugs, promoPriority());
	}
	const politicsList = nationalFeed.length
		? nationalFeed.slice(0, 8)
		: takeUniquePosts(localCity, 8, usedSlugs, promoPriority());
	let lifestyleFeatured = takeUniquePosts(localCity, 1, usedSlugs, promoPriority())[0];
	let lifestyleLinks = takeUniquePosts(localCity, 5, usedSlugs, promoPriority());
	let dualFeatures = takeUniquePosts(localCity, 2, usedSlugs, promoPriority());
	const sciLead = sitemaps?.cm?.[0] ? mapRss(sitemaps.cm[0]) : takeUniquePosts(localCity, 1, usedSlugs, promoPriority())[0];
	const sciMinis = (
		sitemaps?.cm?.slice(1, 6) || takeUniquePosts(localCity, 5, usedSlugs, promoPriority())
	).map(mapRss);
	const popularPool = sortPostsByDate([
		...localCity.filter((p) => p.trending || p.topPost),
		...localCity,
	]).filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i);
	let popularPosts = takeUniquePosts(popularPool, 8, usedSlugs, promoPriority());

	let localColFeatured = takeUniquePosts(localCity, 1, usedSlugs, promoPriority())[0];
	let localColList = takeUniquePosts(localCity, 3, usedSlugs, promoPriority());
	const eventsColFeatured = takeUniquePosts(evenimente, 1, usedSlugs)[0];
	const eventsColList = takeUniquePosts(evenimente, 3, usedSlugs);
	const nationalColFeatured = nationalFeed[0];
	const nationalColList = nationalFeed.slice(1, 4);
	const partnerHeadlines = PARTNER_FEEDS.map(({ key }) => sitemaps?.[key]?.[0]).filter(Boolean).slice(0, 4);

	let latestGrid = takeUniquePosts(localCity, 8, usedSlugs, promoPriority());
	let sidebarPosts = takeUniquePosts(localCity, 5, usedSlugs, promoPriority());

	const ensured = ensureActivePromosOnHomepage(activePromos, usedSlugs, [
		{ key: "topFour", posts: topFour, limit: 4 },
		{ key: "spotlight", posts: spotlight, limit: 6 },
		{ key: "localLatest", posts: localLatest, limit: 6 },
		{ key: "lifestyleLinks", posts: lifestyleLinks, limit: 5 },
		{ key: "dualFeatures", posts: dualFeatures, limit: 2 },
		{ key: "popularPosts", posts: popularPosts, limit: 8 },
		{ key: "localColList", posts: localColList, limit: 3 },
		{ key: "latestGrid", posts: latestGrid, limit: 8 },
		{ key: "sidebarPosts", posts: sidebarPosts, limit: 5 },
	]);
	topFour = ensured.topFour;
	spotlight = ensured.spotlight;
	localLatest = ensured.localLatest;
	lifestyleLinks = ensured.lifestyleLinks;
	dualFeatures = ensured.dualFeatures;
	popularPosts = ensured.popularPosts;
	localColList = ensured.localColList;
	latestGrid = ensured.latestGrid;
	sidebarPosts = ensured.sidebarPosts;
	lifestyleFeatured = lifestyleFeatured || topFour[0];
	localColFeatured = localColFeatured || topFour[0];

	const excerptText = (post) => {
		const raw = post.excerpt || (post.summary || post.description || "").replace(/<[^>]+>/g, "");
		return raw ? `${raw.substring(0, 140)}...` : "";
	};

	return (
		<div className="bn2-homepage nh-hub">
			<h1 className="visually-hidden">{site.pageH1}</h1>
			<SoledadBreakingTicker posts={localCity} />

			{/* Top mosaic + În centrul atenției */}
			{(topFour.length > 0 || spotlight.length > 0) && (
				<section className="nh-top-section">
					<div className="soledad-container">
						<div className="nh-top-layout">
							{topFour.length > 0 && (
								<div className="nh-top-grid">
									{topFour.map((post) => (
										<article key={post.slug} className="nh-story-card">
											<SoledadPostCard data={post} variant="trending" />
											<div className="nh-story-card__body">
												<h2>
													<Link href={getPostHref(post)}>{post.title}</Link>
												</h2>
												{excerptText(post) && <p>{excerptText(post)}</p>}
											</div>
										</article>
									))}
								</div>
							)}
							{spotlight.length > 0 && (
								<aside className="nh-spotlight">
									<h3 className="nh-spotlight__title">În centrul atenției</h3>
									<ul>
										{spotlight.map((post) => (
											<li key={post.slug}>
												<Link href={getPostHref(post)}>{post.title}</Link>
												<span>{formatDate(post.date)}</span>
											</li>
										))}
									</ul>
								</aside>
							)}
						</div>
					</div>
				</section>
			)}

			{/* Latest local | Events */}
			{(localLatest.length > 0 || eventsLatest.length > 0) && (
				<section className="nh-dual-section">
					<div className="soledad-container">
						<div className="nh-dual-cols">
							<CategoryList
								title={`Ultimele din ${site.localBoxTitle.replace("Azi în ", "")}`}
								href={`/categorie/${site.categorySlug}`}
								items={localLatest}
							/>
							<CategoryList
								title="Evenimente & cultură"
								href="/categorie/evenimente-si-cultura"
								items={eventsLatest}
							/>
						</div>
					</div>
				</section>
			)}

			{/* Video / culture highlights */}
			{videoPosts.length > 0 && (
				<section className="nh-section nh-section--alt">
					<div className="soledad-container">
						<h2 className="nh-section__title">
							<Link href="/categorie/evenimente-si-cultura">Evenimente &amp; recomandări</Link>
						</h2>
						<div className="nh-video-grid">
							{videoPosts.map((post) => (
								<SoledadPostCard key={post.slug} data={post} variant="trending" />
							))}
						</div>
					</div>
				</section>
			)}

			{/* World & politics */}
			{politicsList.length > 0 && (
				<section className="nh-section">
					<div className="soledad-container">
						<h2 className="nh-section__title">
							<Link href="/categorie/stiri-nationale-si-internationale">Politică &amp; actualitate</Link>
						</h2>
						<div className="nh-politics-layout">
							{politicsList[0] && (
								<div className="nh-politics-layout__lead">
									<SoledadPostCard
										data={{
											...politicsList[0],
											excerpt: (politicsList[0].summary || politicsList[0].description || "")
												.replace(/<[^>]+>/g, "")
												.substring(0, 200),
										}}
										variant="hero"
									/>
								</div>
							)}
							<SoledadImportedList items={politicsList.slice(1, 5)} />
						</div>
						{politicsList.length > 5 && (
							<ul className="nh-politics-more">
								{politicsList.slice(5, 8).map((post) => (
									<li key={post.slug || post.link}>
										<Link href={postHref(post)}>{post.title}</Link>
										<span>{formatDate(post.isoDate)}</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</section>
			)}

			{/* Life style */}
			{(lifestyleFeatured || lifestyleLinks.length > 0) && (
				<section className="nh-section nh-section--alt">
					<div className="soledad-container">
						<h2 className="nh-section__title">
							<Link href={`/categorie/${site.categorySlug}`}>Viață &amp; stil</Link>
						</h2>
						<div className="nh-lifestyle-layout">
							{lifestyleFeatured && (
								<div className="nh-lifestyle-layout__featured">
									<SoledadPostCard data={lifestyleFeatured} variant="hero" />
								</div>
							)}
							<ul className="nh-lifestyle-links">
								{lifestyleLinks.map((post) => (
									<li key={post.slug}>
										<Link href={getPostHref(post)}>{post.title}</Link>
										<span>{formatDate(post.date)}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>
			)}

			{/* Dual big features */}
			{dualFeatures.length > 0 && (
				<section className="nh-dual-hero">
					<div className="soledad-container">
						<div className="nh-dual-hero__grid">
							{dualFeatures.map((post) => (
								<div key={post.slug} className="nh-dual-hero__item">
									<SoledadPostCard data={post} variant="hero" />
								</div>
							))}
						</div>
					</div>
				</section>
			)}

			{/* Sci-Tech */}
			{sciLead && (
				<section className="nh-section">
					<div className="soledad-container">
						<h2 className="nh-section__title">
							<a href="https://cautimasina.ro" target="_blank" rel="noopener noreferrer">
								Știință &amp; tehnologie
							</a>
						</h2>
						<div className="nh-scitech-layout">
							<div className="nh-scitech-layout__lead">
								<SoledadPostCard data={sciLead} variant="hero" />
								<p className="nh-scitech-layout__excerpt">
									{(sciLead.summary || sciLead.description || sciLead.excerpt || "")
										.replace(/<[^>]+>/g, "")
										.substring(0, 200)}
									...
								</p>
							</div>
							<ul className="nh-scitech-minis">
								{sciMinis.map((post) => (
									<li key={post.slug || post.link}>
										<Link href={postHref(post)}>{post.title}</Link>
										<span>{formatDate(post.date || post.isoDate)}</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</section>
			)}

			{/* Popular articles */}
			{popularPosts.length > 0 && (
				<section className="nh-section nh-section--alt">
					<div className="soledad-container">
						<h2 className="nh-section__title">Articole populare</h2>
						<div className="nh-popular-grid">
							{popularPosts.map((post) => (
								<SoledadPostCard key={post.slug} data={post} variant="trending" />
							))}
						</div>
					</div>
				</section>
			)}

			{/* Four magazine columns */}
			<section className="nh-magazine-cols-wrap">
				<div className="soledad-container">
					<div className="nh-magazine-cols">
						<MagazineColumn
							title={site.localBoxTitle}
							href={`/categorie/${site.categorySlug}`}
							featured={localColFeatured}
							items={localColList}
						/>
						<MagazineColumn
							title="Evenimente & cultură"
							href="/categorie/evenimente-si-cultura"
							featured={eventsColFeatured}
							items={eventsColList}
						/>
						<MagazineColumn
							title="Știri naționale"
							href="/categorie/stiri-nationale-si-internationale"
							featured={nationalColFeatured}
							items={nationalColList}
						/>
						<MagazineColumn
							title="Bine de știut"
							href="/recomandare"
							featured={null}
							items={partnerHeadlines.map((item) => ({
								...item,
								slug: item.guid,
								link: item.link,
							}))}
						/>
					</div>
				</div>
			</section>

			{/* Latest grid + sidebar */}
			{latestGrid.length > 0 && (
				<section className="soledad-section-gap">
					<div className="soledad-container">
						<div className="soledad-main-layout">
							<div>
								<h2 className="soledad-section-title">Ultimele articole</h2>
								<div className="soledad-posts-grid">
									{latestGrid.map((post) => (
										<SoledadPostCard key={post.slug} data={post} variant="grid" />
									))}
								</div>
								<div className="soledad-load-more">
									<Link href={`/categorie/${site.categorySlug}`} className="soledad-btn">
										Mai multe articole
									</Link>
								</div>
							</div>
							<aside className="soledad-sidebar">
								<div className="soledad-widget">
									<span className="soledad-widget__label">{site.sidebarLabel}</span>
									<h3 className="soledad-widget__title">{site.sidebarTitle}</h3>
									<p className="soledad-widget__text">{site.sidebarText}</p>
									<div className="soledad-social-row">
										<a href={SocialLink.fb.url} aria-label="Facebook" rel="noopener noreferrer" target="_blank">
											<i className={SocialLink.fb.icon} />
										</a>
										<a href={SocialLink.twitter.url} aria-label="Twitter" rel="noopener noreferrer" target="_blank">
											<i className={SocialLink.twitter.icon} />
										</a>
										<a href={SocialLink.instagram.url} aria-label="Instagram" rel="noopener noreferrer" target="_blank">
											<i className={SocialLink.instagram.icon} />
										</a>
									</div>
								</div>
								<div className="soledad-widget">
									<h3 className="soledad-widget__title">De citit</h3>
									<ul className="soledad-widget-list">
										{sidebarPosts.map((post) => (
											<li key={post.slug}>
												<Link href={getPostHref(post)}>{post.title}</Link>
												<span className="date">{formatDate(post.date)}</span>
											</li>
										))}
									</ul>
								</div>
								<div className="soledad-widget soledad-widget--newsletter">
									<h3 className="soledad-widget__title">Newsletter</h3>
									<WidgetNewsletter />
								</div>
							</aside>
						</div>
					</div>
				</section>
			)}

			{/* Partner network */}
			<section className="soledad-section-gap soledad-section--alt">
				<div className="soledad-container">
					<h2 className="soledad-section-title">Rețeaua Weboratory</h2>
					<div className="soledad-partner-grid">
						{PARTNER_FEEDS.map(({ key, label, href }) => {
							const item = sitemaps?.[key]?.[0];
							if (!item) return null;
							return (
								<article key={key} className="soledad-partner-card">
									<span className="soledad-partner-card__label">{label}</span>
									<h4>
										<a href={item.link || href}>{item.title}</a>
									</h4>
									<span className="soledad-post-card__date">{formatDate(item.isoDate)}</span>
								</article>
							);
						})}
					</div>
				</div>
			</section>
		</div>
	);
};

export default SoledadNewsHub;
