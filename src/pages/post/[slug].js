import Script from 'next/script';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from "../../../lib/api";
import markdownToHtml from "../../../lib/markdownToHtml";
import Breadcrumb from "../../components/common/Breadcrumb";
import HeadMeta from "../../components/elements/HeadMeta";
import FooterOne from "../../components/footer/FooterOne";
import HeaderOne from "../../components/header/HeaderOne";

import PostFormatStandard from "../../components/post/post-format/PostFormatStandard";
import PostFormatText from "../../components/post/post-format/PostFormatText";

import PostLayoutTwo from "../../components/post/layout/PostLayoutTwo";
import SectionTitle from "../../components/elements/SectionTitle";
import { isRecomandarePost } from "../../../lib/recomandarePosts";
import { getRelatedArticles } from "../../../lib/relatedArticles";
import publication from "../../data/publication";
import { slugify } from "../../utils";
import { absoluteUrl, getCanonicalUrl } from "../../../lib/local-knowledge/seo";

const PostDetails = ({ postContent, relatedPosts }) => {
	const siteUrl = publication.canonicalDomain.replace(/\/$/, '');
	const toAbsoluteUrl = (value) => {
		if (!value) return absoluteUrl(publication.logo || '/images/logo.png');
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
	const modifiedTime = toIsoDate(postContent.dateModified) || publishedTime;
	const publisherName = publication.publicationName || publication.legalCompanyName || 'AziInReșița';
	const publisherLogoUrl = toAbsoluteUrl(publication.logo || '/images/logo.png');
	const categorySlug = postContent.cate ? slugify(postContent.cate) : publication.categorySlug;
	const categoryUrl = getCanonicalUrl(`/categorie/${categorySlug}/`);
	const authorName = postContent.author_name || null;

	const articleJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'NewsArticle',
		headline: postContent.title,
		image: [ogImageUrl],
		...(publishedTime ? { datePublished: publishedTime } : {}),
		...(modifiedTime ? { dateModified: modifiedTime } : {}),
		author: {
			'@type': 'Person',
			name: authorName || publisherName,
			...(authorName
				? { url: getCanonicalUrl(`/autor/${slugify(authorName)}/`) }
				: {}),
		},
		publisher: {
			'@type': 'Organization',
			name: publisherName,
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
		...(postContent.cate ? { articleSection: postContent.cate } : {}),
	};

	const breadcrumbJsonLd = {
		'@context': 'https://schema.org',
		'@type': 'BreadcrumbList',
		itemListElement: [
			{
				'@type': 'ListItem',
				position: 1,
				name: 'Prima pagină',
				item: `${siteUrl}/`,
			},
			...(postContent.cate
				? [
						{
							'@type': 'ListItem',
							position: 2,
							name: postContent.cate,
							item: categoryUrl,
						},
					]
				: []),
			{
				'@type': 'ListItem',
				position: postContent.cate ? 3 : 2,
				name: postContent.title,
				item: postUrl,
			},
		],
	};

	const jsonLd = [articleJsonLd, breadcrumbJsonLd];

	const PostFormatHandler = () => {
		if (postContent.postFormat === 'text') {
			return <PostFormatText postData={postContent} allData={relatedPosts} />;
		}
		return <PostFormatStandard postData={postContent} allData={relatedPosts} />;
	};

	return (
		<>
			{postContent.hasScript && postContent.hasOwnScript && (
				<Script strategy="afterInteractive">{postContent.script}</Script>
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
				articleModifiedTime={modifiedTime}
				articleSection={postContent.cate || undefined}
				jsonLd={jsonLd}
			/>
			<HeaderOne />
			<Breadcrumb bCat={postContent.cate} aPage={postContent.title} />
			<PostFormatHandler />
			{relatedPosts?.length > 0 ? (
				<div className="related-news-wrapper section-gap p-t-xs-15 p-t-sm-60">
					<div className="container">
						<div className="row">
							<div className="col-lg-8">
								<SectionTitle
									title="Articole asemănătoare"
									pClass="m-b-xs-30"
									btnText={postContent.cate || 'Toate știrile'}
									btnUrl={`/categorie/${categorySlug}/`}
								/>
								<div className="axil-content">
									{relatedPosts.map((data) => (
										<PostLayoutTwo data={data} postSizeMd key={data.slug} />
									))}
								</div>
								<p className="m-t-xs-30">
									<Link href={`/categorie/${categorySlug}/`}>
										Mai multe din {postContent.cate || 'această categorie'}
									</Link>
									{' · '}
									<Link href="/stiri/">Arhiva de știri</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			) : null}
			<FooterOne />
		</>
	);
};

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

	const post = getPostBySlug(params.slug, [
		'postFormat',
		'title',
		'quoteText',
		'featureImg',
		'videoLink',
		'audioLink',
		'gallery',
		'date',
		'dateModified',
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
		'isPromo',
		'tags',
	]);
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

	const content = await markdownToHtml(post.content || '');

	const candidatePool = getAllPosts([
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
		'trending',
		'tags',
		'excerpt',
	])
		.filter((p) => p?.slug && !isRecomandarePost(p))
		.sort((a, b) => new Date(b.date) - new Date(a.date))
		.slice(0, 400);

	const relatedPosts = getRelatedArticles(post, candidatePool, { limit: 5 });

	return {
		props: {
			postContent: {
				...post,
				content,
			},
			relatedPosts,
		},
		revalidate: 300,
	};
}
