import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

const PROMO_ENDPOINT = "https://cm.softed.ro/v1/network/affiliate-banners/square";
const DEFAULT_IMG = "/images/posts/promo_banner.png";
const DEFAULT_LINK = "https://departamentuldemarketing.ai";
const AFFILIATE_BANNER_STYLE = {
	width: "100%",
	maxWidth: 320,
	aspectRatio: "1 / 1",
	overflow: "hidden",
	margin: "0 auto",
};

const WidgetAd = ({ img, height, width, link }) => {
	const [promo, setPromo] = useState({ img, link });
	const [isLoading, setIsLoading] = useState(true);

	const fallbackImg = img ?? DEFAULT_IMG;
	const fallbackLink = link ?? DEFAULT_LINK;

	useEffect(() => {
		let isMounted = true;
		const controller = new AbortController();
		setIsLoading(true);

		const fetchPromo = async () => {
			try {
				const response = await fetch(PROMO_ENDPOINT, { signal: controller.signal });
				if (!response.ok) {
					return;
				}

				const data = await response.json();
				if (!isMounted) return;

				const nextImg = data?.image_url;
				const nextLink = data?.href;

				if (nextImg || nextLink) {
					setPromo({
						img: nextImg ?? fallbackImg,
						link: nextLink ?? fallbackLink,
						html: data?.html,
					});
				}
			} catch (error) {
				if (error?.name === "AbortError") return;
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		fetchPromo();
		return () => {
			isMounted = false;
			controller.abort();
		};
	}, [fallbackImg, fallbackLink]);

	const promoImg = promo.img ?? fallbackImg;
	const promoLink = promo.link ?? fallbackLink;
	const isRemoteImage = useMemo(() => /^https?:\/\//.test(promoImg), [promoImg]);

	if (isLoading) {
		return null;
	}

	return (
		<div className="add-block-widget m-b-xs-40" style={AFFILIATE_BANNER_STYLE}>
			{promo.html ? (
				<div dangerouslySetInnerHTML={{ __html: promo.html }} />
			) : (
				<a href={promoLink} target="_blank" rel="noreferrer">
					<Image
						src={promoImg}
						alt="sidebar Ad"
						width={width ?? 320}
						height={height ?? 287}
						className="img-fluid"
						unoptimized={isRemoteImage}
					/>
				</a>
			)}
		</div>
	);
}

export default WidgetAd;
