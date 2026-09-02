import Link from "next/link";
import Offcanvas from 'react-bootstrap/Offcanvas';
import SocialLink from "../../data/social/SocialLink.json";

const OffcanvasMenu = ({ ofcshow, ofcHandleClose }) => {
	return (
		<Offcanvas show={ofcshow} onHide={ofcHandleClose} placement="end" className="offcanvas-menu">
			<Offcanvas.Header closeButton className="close-offcanvasmeu"></Offcanvas.Header>
			<div className="side-nav">
				<div className="side-nav-inner nicescroll-container">
					<div className="side-nav-content">
						<div className="row ">
							<div className="col-lg-6">
								<ul className="main-navigation side-navigation list-inline flex-column">
									<li>
										<Link href="/categorie/azi-in-alexandria">
											Știrile zilei în Alexandria
										</Link>
									</li>
									<li>
										<Link href="/categorie/stiri-nationale-si-internationale">
											Știri naționale și internaționale
										</Link>
									</li>
									<li>
										<Link href="/categorie/evenimente-si-cultura">
											Evenimente și Cultură în Alexandria
										</Link>
									</li>
									{/* <li>
										<Link href="/categorie/stiri-generale">
											Știri Generale
										</Link>
									</li> */}
								</ul>
								<li>
						<Link href="/recomandare/">
							Recomandări
						</Link>
					</li>
					{/* End of .main-navigation */}
							</div>
							{/* End of  .col-md-6 */}
							<div className="col-lg-6">
								<div className="axil-contact-info-inner">
									<h5 className="h5 m-b-xs-10">
										Contact
									</h5>
									<div className="axil-contact-info">
										<address className="address">
											<p className="m-b-xs-30  mid grey-dark-three ">
												contact@weboratory.ro
											</p>
										</address>
										{/* End of address */}
										<div className="contact-social-share m-t-xs-30">
											<div className="axil-social-title h5">Suntem si pe</div>
											<ul className="social-share social-share__with-bg">
												<li>
													<a href={SocialLink.fb.url}>
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
										{/* End of .contact-shsdf */}
									</div>
									{/* End of .axil-contact-info */}
								</div>
								{/* End of .axil-contact-info-inner */}
							</div>
						</div>
						{/* End of .row */}
					</div>
				</div>
				{/* End of .side-nav-inner */}
			</div>
		</Offcanvas>
	);
}

export default OffcanvasMenu;