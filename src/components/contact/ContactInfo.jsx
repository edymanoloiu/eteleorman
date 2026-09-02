import SocialLink from "../../data/social/SocialLink.json";

const ContactInfo = () => {
	return (
		<div className="axil-contact-info-wrapper p-l-md-45 m-b-xs-30">
			<div className="axil-contact-info-inner">
				<h2 className="h4 m-b-xs-10">Contact</h2>
				<div className="axil-contact-info">
					<address className="address">
						<p className="mid m-b-xs-30">
							contact@weboratory.ro
						</p>
					</address>
					{/* End of address */}
					<div className="contact-social-share m-t-xs-30">
						<div className="axil-social-title h5">Follow Us</div>
						<ul className="social-share social-share__with-bg">
							<li>
								<a href="https://web.facebook.com/profile.php?id=61560279465691">
									<i className={SocialLink.fb.icon} />
								</a>
							</li>
							<li>
								<a href={SocialLink.twitter.url}>
									<i className={SocialLink.twitter.icon} />
								</a>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactInfo;
