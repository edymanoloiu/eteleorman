import Script from 'next/script';
import { getAllPosts } from "../../../lib/postsList.js";
import { getPostBySlug } from "../../../lib/postBody.js";
import markdownToHtml from "../../../lib/markdownToHtml";
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";

import PostFormatStandard from "../../components/post/post-format/PostFormatStandard";
import PostFormatText from "../../components/post/post-format/PostFormatText";

import PostSectionSix from "../../components/post/PostSectionSix";
import { isRecomandarePost } from "../../../lib/recomandarePosts";

const PostDetails = ({ postContent, allPosts }) => {
	const siteUrl = 'https://eteleorman.ro';
	const toAbsoluteUrl = (value) => {
		if (!value) return `${siteUrl}/images/logo.png`;
		if (value.startsWith('http://') || value.startsWith('https://')) {
			return value;
		}
		return `${siteUrl}${value.startsWith('/') ? '' : '/'}${value}`;
	};
	const toPlainText = (value) => (value || '')
		.replace(/<[^>]*>/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
	const toIsoDate = (value) => {
		if (!value) return undefined;
		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
	};

	const postUrl = `${siteUrl}/post/${postContent.slug}/`;
	const ogImageUrl = toAbsoluteUrl(postContent.featureImg);
	const metaDescription = postContent.excerpt || toPlainText(postContent.content).slice(0, 200);
	const publishedTime = toIsoDate(postContent.date);
	const publisherLogoUrl = toAbsoluteUrl('/images/logo.png');
	const publisherLabel = 'eteleorman.ro';
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		headline: postContent.title,
		image: [ogImageUrl],
		...(publishedTime ? { datePublished: publishedTime, dateModified: publishedTime } : {}),
		author: {
			'@type': 'Person',
			name: postContent.author_name || publisherLabel,
		},
		publisher: {
			'@type': 'Organization',
			name: publisherLabel,
			logo: {
				'@type': 'ImageObject',
				url: publisherLogoUrl,
			},
		},
		description: metaDescription,
		mainEntityOfPage: {
			'@type': 'WebPage',
			'@id': postUrl,
		},
	};

const PostFormatHandler = () => {
		if (postContent.postFormat === 'text') {
			return <PostFormatText postData={postContent} allData={allPosts} />
		} else {
			return <PostFormatStandard postData={postContent} allData={allPosts} />
		}
	}

	return (
		<>
			{postContent.hasScript && postContent.hasOwnScript &&
				<Script strategy="afterInteractive">
					{postContent.script}
				</Script>
			}
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
}

export default PostDetails;

export async function getStaticPaths() {
	return {
		paths: [],
		fallback: 'blocking',
	};
}

export async function getStaticProps({ params }) {
	const slug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug;
	if (!slug || typeof slug !== 'string') {
		return { notFound: true };
	}

	const post = await getPostBySlug(params.slug, [
		'postFormat',
		'title',
		'quoteText',
		'featureImg',
		'videoLink',
		'audioLink',
		'gallery',
		'date',
		'slug',
		'cate',
		'cate_bg',
		'author_name',
		'author_img',
		'author_bio',
		'author_social',
		'post_views',
		'post_share',
		'content',
		'featureImgSrc',
		'excerpt',
		'hasOwnScript',
		'script',
		'hasScript',
		'isPromo'
	])
	if (!post || !post.slug) {
		return { notFound: true };
	}

	if (isRecomandarePost(post)) {
		return {
			redirect: {
				destination: `/recomandare/${slug}/`,
				permanent: true,
			},
		};
	}

	const content = await markdownToHtml(post.content || '')

	const allPosts = (await getAllPosts([
		'title',
		'featureImg',
		'featureImgSrc',
		'postFormat',
		'date',
		'slug',
		'cate',
		'cate_bg',
		'cate_img',
		'author_name',
		'trending'
	])).sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 150);

	return {
		props: {
			postContent: {
				...post,
				content
			},
			allPosts
		},
		revalidate: 300,
	};
}

