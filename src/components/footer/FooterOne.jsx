import Image from "next/image";
import Link from "next/link";
import SocialLink from "../../data/social/SocialLink.json";
import publication from "../../data/publication";
import { getFooterEditorialLinks } from "../../../lib/local-knowledge/navigation";

const FooterOne = () => {
	const socialLinks = [
		{ key: "fb", label: "Facebook" },
		{ key: "twitter", label: "Twitter" },
	].filter(({ key }) => Boolean(SocialLink[key]?.url));
	const editorialLinks = getFooterEditorialLinks();

	return (
		<footer className="page-footer bg-grey-dark-key">
			<div className="container">
				<div className="footer-mid">
					<div className="row align-items-center">
						<div className="col-md">
							<div className="footer-logo-container">
					<Link href="/">
								<Image
									src={publication.favicon || "/images/cropped_image.png"}
									alt={`${publication.publicationTagline || publication.publicationName} - Logo`}
									className="footer-logo"
									width={86}
									height={86}
									loading="lazy"
								/>
							</Link>
							</div>
						</div>
						<div className="col-md-auto">
							<div className="footer-social-share-wrapper">
								<div className="footer-social-share">
									<div className="axil-social-title">Urmărește-ne</div>
									<ul className="social-share social-share__with-bg">
										{socialLinks.map(({ key, label }) => (
											<li key={key}>
												<a href={SocialLink[key].url} aria-label={label} rel="noopener noreferrer" target="_blank">
													<i className={SocialLink[key].icon} />
												</a>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="footer-bottom">
					<ul id="menu-footer-bottom-menu" className="footer-bottom-links">
						{editorialLinks.slice(0, 6).map((link) => (
							<li key={link.path}>
								<Link href={link.path}>{link.label}</Link>
							</li>
						))}
						<li>
							<Link href="/reteaua-weboratory">Rețeaua Weboratory</Link>
						</li>
						<li>
							<Link href="/termeni-si-conditii">Termeni și condiții</Link>
						</li>
						<li>
							<Link href="/gdpr">Confidențialitate</Link>
						</li>
						<li>
							<Link href="/cookies">Cookie-uri</Link>
						</li>
					</ul>
					<p className="axil-copyright-txt">
						© {new Date().getFullYear()} {publication.publicationTagline || publication.publicationName}. Platformă locală de cunoaștere și știri pentru {publication.city}. Pentru sesizări sau corecturi: <a href={`mailto:${publication.editorialEmail}`}>{publication.editorialEmail}</a>.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default FooterOne;
