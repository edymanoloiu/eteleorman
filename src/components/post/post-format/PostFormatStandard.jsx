import WidgetAd from "../../widget/WidgetAd";
import WidgetPost from "../../widget/WidgetPost";
import MetaDataOne from "./elements/meta/MetaDataOne";
import PostAuthor from "./elements/PostAuthor";
import SocialShareSide from "./elements/SocialShareSide";

const getDomainName = (url) => {
	// Add protocol if missing
	if (!/^https?:\/\//i.test(url)) {
		url = "http://" + url;
	}

	try {
		const hostname = new URL(url).hostname;
		// Remove "www." if present
		return hostname.replace(/^www\./, '');
	} catch (e) {
		return null;
	}
}

const removeDuplicateFeatureImage = (content, featureImg) => {
	if (!content || !featureImg) {
		return content;
	}

	const leadingImage = /^\s*<p>\s*<img\b[^>]*\bsrc=(["'])([^"']+)\1[^>]*>\s*<\/p>\s*/i.exec(content);
	if (!leadingImage) {
		return content;
	}

	const normalizeImageSrc = (src) => src
		.replaceAll('&amp;', '&')
		.replaceAll('&#x26;', '&')
		.replaceAll('&#38;', '&');

	if (normalizeImageSrc(leadingImage[2]) !== normalizeImageSrc(featureImg)) {
		return content;
	}

	return content.slice(leadingImage[0].length);
};


const PostFormatStandard = ({ postData, allData }) => {
	const basePathLink = process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH ?? "" : "";

	const postContent = removeDuplicateFeatureImage(postData.content, postData.featureImg)
		.replaceAll('/images/', basePathLink + '/images/');

	const host = getDomainName(postData.featureImg);

	return (
		<>
			<MetaDataOne metaData={postData} />
			<div className="post-single-wrapper p-t-xs-60">
				<div className="container">
					<div className="row">
						<div className="col-lg-8">
							<main className="site-main">
								<article className="post-details">
									<div className="single-blog-wrapper">
										<SocialShareSide />
										<div dangerouslySetInnerHTML={{ __html: postContent }}></div>

									<div
										className="ai-transparency-note"
										data-ai-content="ai-assisted"
										data-human-reviewed="true"
										style={{
											fontSize: '0.95rem',
											lineHeight: 1.5,
											marginTop: '1.25rem',
											padding: '0.75rem 1rem',
											borderLeft: '3px solid #d0d7de',
											background: '#f6f8fa',
										}}
									>
										<strong>Transparență AI:</strong> Acest material poate fi redactat sau structurat cu ajutorul unor instrumente AI și este verificat editorial înainte de publicare. Imaginile generate sau modificate cu AI sunt folosite cu rol ilustrativ.
									</div>
									</div>
									{!postData.isPromo && !postData.hasOwnScript && !postData.hasScript && !host.includes('pexels') &&
										<span style={{ 'fontSize': '1rem' }} >
											<i>*Informațiile au fost preluate din presa locală și naționala.</i>
										</span>
									}
								</article>
								<hr className="m-t-xs-50 m-b-xs-60" />

								<PostAuthor authorData={postData} />
							</main>
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
		</>
	);
}

export default PostFormatStandard;