import ImageWithFallback from "../common/ImageWithFallback";
import { LOCAL_AVATAR_FALLBACK } from "../../../lib/imageFallback";
import Link from "next/link";
import { slugify } from "../../utils";

const TeamOne = ({data}) => {
	return (
		<div className="axil-team-block m-b-xs-30">
			<Link href={`/autor/${slugify(data.author_name)}`}>
				<div className="d-block img-container">
					<ImageWithFallback
						src={data.author_img}
						fallbackSrc={LOCAL_AVATAR_FALLBACK}
						alt={data.author_name}
						width={350}
						height={350}
					/>
				</div>
			</Link>
			<div className="axil-team-inner-content text-center">
				<h3 className="axil-member-title hover-line">
					<Link href={`/autor/${slugify(data.author_name)}`}>
						{data.author_name}
					</Link>
				</h3>
				<div className="axil-designation">
					{data.author_desg}
				</div>
			</div>
			<div className="axil-team-share-wrapper">
				<ul className="social-share social-share__with-bg social-share__with-bg-white social-share__vertical">
					{data.author_social.map((social) => (
						<li key={social.url}>
							<a href={social.url}><i className={social.icon} /></a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default TeamOne;
