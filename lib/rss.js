import RSS from 'rss';
import { isRecomandarePost } from './recomandarePosts.js';
import publication from '../src/data/publication.js';

export function generateRssFeed(posts) {
	const seo = publication.seo || {};
	const feed = new RSS({
		title: seo.openGraph?.title || seo.title || publication.publicationName,
		description: seo.description || publication.publicationTagline,
		site_url: publication.canonicalDomain,
		feed_url: `${publication.canonicalDomain.replace(/\/$/, '')}/rss.xml`,
		language: publication.language || 'ro',
		image_url: `${publication.canonicalDomain.replace(/\/$/, '')}/images/cropped_image.png`
	});

	posts.slice(0, 25).forEach(post => {
		feed.item({
			title: post.title,
			description: post.excerpt,
			url: `${feed.site_url.replace(/\/$/, '')}${isRecomandarePost(post) ? '/recomandare/' : '/post/'}${post.slug}`,
			date: post.date,
			categories: post.tags,
			enclosure: {
				url: post.featureImg,
				type: 'image/jpeg',
			},
		});
	});

	return feed.xml({ indent: true });
}
