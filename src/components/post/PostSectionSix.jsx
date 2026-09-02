
import SectionTitle from "../elements/SectionTitle";
import PostLayoutOne from "./layout/PostLayoutOne";
import PostLayoutTwo from "./layout/PostLayoutTwo";
import { SortingByDate } from "../../utils";


const PostSectionSix = ({ postData }) => {
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
								title="Știri recente"
								pClass="m-b-xs-30"
								btnText="Toate știrile"
								btnUrl="/stiri/"
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

export default PostSectionSix;