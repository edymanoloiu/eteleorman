import Link from "next/link";
import HeadMeta from "../components/elements/HeadMeta";
import FooterOne from "../components/footer/FooterOne";
import HeaderOne from "../components/header/HeaderOne";
import Breadcrumb from "../components/common/Breadcrumb";
import BreadcrumbBanner from "../components/common/BreadcrumbBanner";
import partnerSites from "../data/partnerSites";

const ReteauaWeboratoryPage = () => {
	return (
		<>
			<HeadMeta
				metaTitle="Rețeaua Weboratory"
				metaDesc="Toate site-urile din rețeaua Weboratory Capital: știri locale, partenere și educative."
			/>
			<HeaderOne />
			<Breadcrumb aPage="Rețeaua Weboratory" />
			<BreadcrumbBanner pageTitle="Rețeaua Weboratory" />
			<div className="container axil-post-list-area axil-section-gap bg-color-white">
				<div className="row">
					<div className="col-lg-12">
						<div className="axil-content">
							<p className="mb-4">
								Mai jos găsiți toate site-urile din rețeaua media Weboratory Capital, grupate pe categorii.
							</p>
						</div>
					</div>
				</div>
				<div className="row">
					<div className="col-lg-6">
						<div className="axil-content">
							{partnerSites.filter((_, i) => i % 2 === 0).map((group, index) => (
								<section key={group.title + index} className="mb-5">
									<h2 className="mb-3 h4">{group.title}</h2>
									<ul className="list-unstyled">
										{group.sites.map((site, siteIndex) => (
											<li key={siteIndex} className="mb-2">
												<Link
													href={site.url}
													target="_blank"
													className="text-decoration-none"
												>
													{site.label}
												</Link>
											</li>
										))}
									</ul>
								</section>
							))}
						</div>
					</div>
					<div className="col-lg-6">
						<div className="axil-content">
							{partnerSites.filter((_, i) => i % 2 === 1).map((group, index) => (
								<section key={group.title + index} className="mb-5">
									<h2 className="mb-3 h4">{group.title}</h2>
									<ul className="list-unstyled">
										{group.sites.map((site, siteIndex) => (
											<li key={siteIndex} className="mb-2">
												<Link
													href={site.url}
													target="_blank"
													className="text-decoration-none"
												>
													{site.label}
												</Link>
											</li>
										))}
									</ul>
								</section>
							))}
						</div>
					</div>
				</div>
			</div>
			<FooterOne />
		</>
	);
};

export default ReteauaWeboratoryPage;
