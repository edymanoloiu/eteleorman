import AdBanner from "../common/AdBanner";
import SectionTitle from "../elements/SectionTitle";
import WidgetAd from "../widget/WidgetAd";
import WidgetPost from "../widget/WidgetPost";
import PostLayoutTwo from "./layout/PostLayoutTwo";

const PostSectionFive = ({ postData, adBanner, pClass, allData, imported }) => {
	const posts = (postData || []).slice(0, 8);

	return (
		<div className={`random-posts ${pClass ?? "section-gap"}`}>
			<div className="container">
				<SectionTitle title="Știri naționale și internaționale" btnText="Toate știrile" btnUrl="/categorie/stiri-nationale-si-internationale" />
				<div className="row">
					<div className="col-lg-8">
						{adBanner === true ? <AdBanner /> : ""}
						<div className="axil-content">
							{posts.map((data, index) => (
								<PostLayoutTwo data={data} postSizeMd={true} imported={imported} key={data?.slug || data?.guid || data?.link || index} />
							))}

						</div>
					</div>
					<div className="col-lg-4">
						<div className="post-sidebar">
							<WidgetAd />
							<WidgetPost dataPost={allData} />
						</div>
					</div>
				</div>
			</div>
		</div>

	);
}

export default PostSectionFive;
