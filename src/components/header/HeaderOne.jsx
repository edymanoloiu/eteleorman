import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { dateFormate } from "../../utils";
import SocialLink from "../../data/social/SocialLink.json";
import MenuData from "../../data/menu/HeaderMenu.json";
import publication from "../../data/publication";
import OffcanvasMenu from "./OffcanvasMenu";

const HeaderOne = () => {
	// Main Menu Toggle
	var menuRef = useRef();

	const toggleDropdownMenu = () => {
		const dropdownSelect = menuRef.current.childNodes;
		let dropdownList = [];

		for (let i = 0; i < dropdownSelect.length; i++) {
			const element = dropdownSelect[i];
			if (element.classList.contains("has-dropdown")) {
				dropdownList.push(element);
			}
		}

		dropdownList.forEach((element) => {
			element.children[0].addEventListener("click", () => {
				if (element.classList.contains("active")) {
					element.classList.remove("active");
					element.childNodes[1].classList.remove("opened");
				} else {
					dropdownList.forEach((submenu) => {
						if (element !== submenu) {
							submenu.classList.remove("active");
							submenu.childNodes[1].classList.remove("opened");
						} else {
							submenu.classList.add("active");
							submenu.childNodes[1].classList.add("opened");
						}
					});
				}
			});
		});
	};

	const [weather, setWeather] = useState({});

	const getWeather = () => {
		const apiKey = '4b3ab7d7eafa4f569b5105145252207'; // Replace with your actual WeatherAPI key
		const city = 'Alexandria';
		const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&aqi=no`;

		fetch(url)
			.then(response => {
				if (!response.ok) {
					console.log('error with weatherapi');
				}

				response.json().then(data => setWeather(data));
			})
			.catch(error => {
				console.log('error with weatherapi', error);
			});

	}

	useEffect(() => {
		getWeather();
		toggleDropdownMenu();
	}, []);

	// Offcanvas Menu
	const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	// Mobile Menu Toggle
	const [mobileToggle, setMobileToggle] = useState(false);

	const MobileMenuToggler = () => {
		setMobileToggle(!mobileToggle);
		const HtmlTag = document.querySelector("html");
		const menuSelect = document.querySelectorAll(".main-navigation li");

		if (HtmlTag.classList.contains("main-menu-opened")) {
			HtmlTag.classList.remove("main-menu-opened");
		} else {
			setTimeout(() => {
				HtmlTag.classList.add("main-menu-opened");
			}, 800);
		}

		menuSelect.forEach((element) => {
			element.addEventListener("click", function () {
				if (!element.classList.contains("has-dropdown")) {
					HtmlTag.classList.remove("main-menu-opened");
					setMobileToggle(false);
				}
			});
		});
	};

	return (
		<>
			<OffcanvasMenu ofcshow={show} ofcHandleClose={handleClose} />
			<header className="page-header">
				<div className="header-top bg-grey-dark-one">
					<div className="container">
						<div className="row align-items-center">
							<div className="col-md">
								<ul className="header-top-nav list-inline justify-content-center justify-content-md-start">
									<li className="current-date">{dateFormate()}</li>
									{weather?.current ?
										<li style={{ 'display': 'flex', alignItems: 'center' }}>Azi în Alexandria | <img style={{ 'width': '2rem', 'height': '2rem' }} src={weather.current?.condition?.icon} />{`${weather.current?.temp_c} °C`} | Tot ce contează, azi, în Alexandria.</li> :
										<li>Azi în Alexandria | Tot ce contează, azi, în Alexandria.</li>
									}
								</ul>
							</div>
							<div className="col-md-auto">
								<ul className="ml-auto social-share header-top__social-share">
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
									<li>
										<a href={SocialLink.instagram.url}>
											<i className={SocialLink.instagram.icon} />
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<nav className="navbar bg-white">
					<div className="container">
						<div className="navbar-inner">
							<div className="brand-logo-container">
								<Link href="/">
									
										<Image
											src={publication.favicon || "/images/cropped_image.png"}
											alt={publication.publicationName}
											width={56}
											height={56}
										/>
									
								</Link>
							</div>
							<div className="main-nav-wrapper">
								<ul className="main-navigation list-inline" ref={menuRef}>
									{MenuData.map((data, index) =>
										data.submenu ? (
											<li className="has-dropdown" key={index}>
												<Link href={data.path}>
													{data.label}
												</Link>
												<ul className="submenu">
													{data.submenu.map((data, index) => (
														<li key={index}>
															<Link href={data.subpath}>
																{data.sublabel}
															</Link>
														</li>
													))}
												</ul>
											</li>
										) : (
											<li key={index}>
												<Link href={data.path}>
													{data.label}
												</Link>
											</li>
										)
									)}
								</ul>
							</div>
							<div className="navbar-extra-features ml-auto">
								<button className="side-nav-toggler" onClick={handleShow}>
									<span />
									<span />
									<span />
								</button>
							</div>
							<div
								className={`main-nav-toggler d-block d-lg-none ${mobileToggle ? "expanded" : ""
									}`}
							>
								<div className="toggler-inner" onClick={MobileMenuToggler}>
									<span />
									<span />
									<span />
								</div>
							</div>
						</div>
					</div>
				</nav>
			</header>
		</>
	);
};

export default HeaderOne;
