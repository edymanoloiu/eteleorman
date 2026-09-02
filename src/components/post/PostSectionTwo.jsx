import SectionTitle from "../elements/SectionTitle";
import PostLayoutThree from "./layout/PostLayoutThree";

const PostSectionTwo = ({ postData }) => {

	const storyPost = postData.filter(post => post.story === true);

	return (
		<div className="section-gap section-gap-top__with-text top-stories bg-grey-light-three">
			<div className="container">
				<SectionTitle title="Evenimente și Cultură în Alexandria" btnText="Afla mai multe!" btnUrl="/categorie/evenimente-si-cultura"/>
				<div className="row">
					<div className="col-lg-8">
						{storyPost.slice(0, 3).map((data) => (
							<PostLayoutThree data={data} postSizeLg={true} key={data.slug} />
						))}
					</div>
					<div className="col-lg-4">
						{storyPost.slice(3, 9).map((data) => (
							<PostLayoutThree data={data} key={data.slug} />
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PostSectionTwo;
