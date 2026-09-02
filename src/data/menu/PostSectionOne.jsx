import { SortingByDate } from "../../utils";
import SectionTitle from "../elements/SectionTitle";
import PostLayoutOne from "./layout/PostLayoutOne";
import PostLayoutTwo from "./layout/PostLayoutTwo";

const PostSectionOne = ({ postData }) => {
	SortingByDate(postData);
	return (
		<div className="recent-news-wrapper section-gap p-t-xs-15 p-t-sm-60">
			<div className="container">
				<div className="row">
					<div className="col-lg-6">
						{postData.slice(0, 3).map((data) => (
							<PostLayoutOne data={data} key={data.slug} />
						))}
					</div>
					<div className="col-lg-6">
						<div className="axil-recent-news">
							<SectionTitle
								title="Azi în Alexandria"
								pClass="m-b-xs-30"
								btnText="Toate știrile"
								btnUrl="/categorie/azi-in-alexandria"
							/>
							<div className="axil-content">
								{postData.slice(3, 14).map((data) => (
									<PostLayoutTwo data={data} key={data.slug} />
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default PostSectionOne;