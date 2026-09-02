import RSS from 'rss';
import { isRecomandarePost } from './recomandarePosts.js';

export function generateRssFeed(posts) {
	const siteUrl = 'https://eteleorman.ro';
	const feed = new RSS({
		title: 'Azi în Alexandria | Cele mai importante știri din Alexandria. Află tot ce contează, azi, în Alexandria',
		description: 'Azi în Alexandria este platforma locală de știri care îți aduce rapid și clar cele mai importante informații din Alexandria și județul Teleorman. Publicăm zilnic actualizări esențiale despre evenimente, administrație, trafic, cultură, comunitate și subiecte care influențează viața de zi cu zi a locuitorilor. Scris într-un stil accesibil și verificat, conținutul nostru este optimizat pentru motoare de căutare și pentru răspunsuri directe în asistenți vocali, astfel încât să găsești instant ceea ce te interesează. Dacă vrei să fii mereu la curent cu tot ce se întâmplă în Alexandria, Azi în Alexandria este sursa ta de încredere.',
		site_url: siteUrl,
		feed_url: `${siteUrl}/rss.xml`,
		language: 'ro',
		image_url: 'https://eteleorman.ro/images/cropped_image.png',
	});

	posts.slice(0, 50).forEach((post) => {
		if (!post?.slug || !post?.title) return;
		const segment = isRecomandarePost(post) ? 'recomandare' : 'post';
		const itemUrl = `${siteUrl}/${segment}/${post.slug}/`;
		const imageUrl = post.featureImg
			? post.featureImg.startsWith('http')
				? post.featureImg
				: `${siteUrl}${post.featureImg.startsWith('/') ? '' : '/'}${post.featureImg}`
			: undefined;

		const item = {
			title: post.title,
			description: post.excerpt || '',
			url: itemUrl,
			guid: itemUrl,
			date: post.date,
			categories: post.tags || (post.cate ? [post.cate] : []),
		};

		if (post.author_name) {
			item.author = post.author_name;
		}

		if (imageUrl) {
			item.enclosure = {
				url: imageUrl,
				type: 'image/jpeg',
			};
		}

		feed.item(item);
	});

	return feed.xml({ indent: true });
}
