import Script from 'next/script';
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import { isRecomandarePost } from "../../../lib/recomandarePosts";
import markdownToHtml from "../../../lib/markdownToHtml";
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";
import PostFormatStandard from "../../components/post/post-format/PostFormatStandard";
import PostFormatText from "../../components/post/post-format/PostFormatText";
import PostSectionSix from "../../components/post/PostSectionSix";
import publication from "../../data/publication";
import { absoluteUrl } from "../../../lib/local-knowledge/seo";

const PostDetails = ({ postContent, allPosts }) => {
	const siteUrl = publication.canonicalDomain.replace(/\/$/, '');
	const toAbsoluteUrl = (value) => {
		if (!value) return absoluteUrl(publication.logo || '/images/logo.png');
		if (value.startsWith('http://') || value.startsWith('https://')) return value;
		return `${siteUrl}${value.startsWith('/') ? '' : '/'}${value}`;
	};
	const toPlainText = (value) => (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	const toIsoDate = (value) => {
		if (!value) return undefined;
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
	};
	const postUrl = `${siteUrl}/recomandare/${postContent.slug}/`;
	const ogImageUrl = toAbsoluteUrl(postContent.featureImg);
	const metaDescription = postContent.excerpt || toPlainText(postContent.content).slice(0, 200);
	const publishedTime = toIsoDate(postContent.date);
	const publisherLogoUrl = toAbsoluteUrl(publication.logo || '/images/logo.png');
	const publisherLabel = publication.publicationName || 'AziInReșița';
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: postContent.title,
		image: [ogImageUrl],
		...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
		author: { '@type': 'Person', name: postContent.author_name || publisherLabel },
		publisher: {
			'@type': 'Organization',
			name: publisherLabel,
			logo: { '@type': 'ImageObject', url: publisherLogoUrl },
		},
		description: metaDescription,
		mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
	};
	const PostFormatHandler = () =>
		postContent.postFormat === 'text' ? (
			<PostFormatText postData={postContent} allData={allPosts} />
		) : (
			<PostFormatStandard postData={postContent} allData={allPosts} />
		);
	return (
		<>
			{postContent.hasScript && postContent.hasOwnScript && postContent.script && (
				<Script strategy="lazyOnload">{postContent.script}</Script>
			)}
			<HeadMeta
				metaTitle={postContent.title}
				metaDesc={metaDescription}
				metaImg={ogImageUrl}
				canonicalUrl={postUrl}
				ogUrl={postUrl}
				ogType="article"
				keywords={postContent.cate || undefined}
				articlePublishedTime={publishedTime}
				articleModifiedTime={publishedTime}
				articleSection={postContent.cate || undefined}
				jsonLd={jsonLd}
			/>
			<HeaderOne />
			<Breadcrumb bCat={postContent.cate} aPage={postContent.title} />
			<PostFormatHandler />
			<PostSectionSix postData={allPosts.sort((a, b) => new Date(b.date) - new Date(a.date))} all={true} />
			<FooterOne />
		</>
	);
};

export default PostDetails;

export async function getServerSideProps({ params }) {
	const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
	if (!slug || typeof slug !== 'string') return { notFound: true };
	const post = getPostBySlug(slug, [
		'postFormat', 'title', 'quoteText', 'featureImg', 'videoLink', 'audioLink', 'gallery', 'date', 'slug',
		'cate', 'cate_bg', 'author_name', 'author_img', 'author_bio', 'author_social', 'post_views', 'post_share',
		'content', 'featureImgSrc', 'hasScript', 'excerpt', 'hasOwnScript', 'script', 'isPromo', 'tags',
	]);
	if (!post || !post.slug) return { notFound: true };
	if (!isRecomandarePost(post)) return { notFound: true };
	const content = await markdownToHtml(post.content || '');
	const allPosts = getAllPosts([
		'title', 'featureImg', 'featureImgSrc', 'postFormat', 'date', 'slug', 'cate', 'cate_bg', 'cate_img',
		'author_name', 'trending', 'isPromo', 'tags',
	])
		.filter((p) => !isRecomandarePost(p))
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 100);
	return {
		props: {
			postContent: { ...post, content },
			allPosts,
		},
	};
}
