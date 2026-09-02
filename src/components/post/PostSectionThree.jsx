import SectionTitle from "../elements/SectionTitle";
import PostLayoutTwo from "./layout/PostLayoutTwo";

const PostSectionThree = ({ postData, imported }) => {
	const trendingPosts = (Object.values(postData).filter(data => data?.length) || []).flat();

	return (
		<div className="section-gap section-gap-top__with-text trending-stories">
			<div className="container">
				<SectionTitle title="Bine de știut" />
				<div className="row">
					{trendingPosts.map((data, index) => (
						<div className="col-lg-6" key={index}>
							<PostLayoutTwo data={data} imported={imported} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default PostSectionThree;
