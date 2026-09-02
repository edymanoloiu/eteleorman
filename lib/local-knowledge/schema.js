import { CONTENT_TYPE_IDS, PUBLIC_STATUSES } from './contentTypes.js';

const REQUIRED_COMMON = [
	'title',
	'slug',
	'contentType',
	'status',
	'description',
	'datePublished',
	'dateModified',
	'author',
	'category',
	'city',
	'county',
];

/**
 * Validează frontmatter-ul unui document evergreen (schema nouă).
 * Returnează { ok, errors[], warnings[] }.
 */
export function validateFrontmatter(data, { requireSources = false } = {}) {
	const errors = [];
	const warnings = [];

	if (!data || typeof data !== 'object') {
		return { ok: false, errors: ['Frontmatter lipsă sau invalid'], warnings };
	}

	for (const field of REQUIRED_COMMON) {
		if (data[field] === undefined || data[field] === null || data[field] === '') {
			errors.push(`Câmp obligatoriu lipsă: ${field}`);
		}
	}

	if (data.contentType && !CONTENT_TYPE_IDS.includes(data.contentType)) {
		errors.push(`contentType invalid: ${data.contentType}`);
	}

	if (data.status && !PUBLIC_STATUSES.includes(data.status)) {
		errors.push(`status invalid: ${data.status}`);
	}

	if (data.featuredImage && !data.featuredImageAlt) {
		errors.push('featuredImageAlt este obligatoriu când există featuredImage');
	}

	if (data.datePublished && Number.isNaN(Date.parse(data.datePublished))) {
		errors.push(`datePublished invalid: ${data.datePublished}`);
	}

	if (data.dateModified && Number.isNaN(Date.parse(data.dateModified))) {
		errors.push(`dateModified invalid: ${data.dateModified}`);
	}

	if (data.contentType === 'event') {
		if (data.eventStart && Number.isNaN(Date.parse(data.eventStart))) {
			errors.push(`eventStart invalid: ${data.eventStart}`);
		}
		if (data.eventEnd && data.eventStart && Date.parse(data.eventEnd) < Date.parse(data.eventStart)) {
			errors.push('eventEnd este înainte de eventStart');
		}
	}

	if (Array.isArray(data.sources)) {
		data.sources.forEach((s, i) => {
			if (!s?.name) warnings.push(`sources[${i}] fără name`);
			if (s?.url && !/^https?:\/\//i.test(s.url)) {
				errors.push(`sources[${i}].url invalid`);
			}
		});
	} else if (requireSources && data.status === 'published') {
		warnings.push('sources lipsește pentru conținut publicat');
	}

	if (data.status === 'published' && data.datePublished) {
		const pub = Date.parse(data.datePublished);
		if (pub > Date.now() + 60_000) {
			errors.push('Conținut published cu datePublished în viitor');
		}
	}

	return { ok: errors.length === 0, errors, warnings };
}

/**
 * Normalizează un articol vechi (posts/) la schema comună.
 */
export function normalizeLegacyNews(post, publication) {
	const dateIso = toIsoDate(post.date);
	return {
		title: post.title || '',
		slug: post.slug,
		contentType: 'news',
		status: 'published',
		description: post.excerpt || '',
		datePublished: dateIso,
		dateModified: dateIso,
		author: post.author_name || 'Redacția',
		editor: post.author_name || 'Redacția',
		category: post.cate || publication.localCate,
		tags: Array.isArray(post.tags) ? post.tags : [],
		city: publication.city,
		county: publication.county,
		featuredImage: post.featureImg || post.thumb || publication.defaultSocialImage,
		featuredImageAlt: post.featureImgAlt || post.title || '',
		sources: [],
		// legacy passthrough
		_legacy: true,
		postFormat: post.postFormat,
		cate: post.cate,
		cate_bg: post.cate_bg,
		story: post.story,
		trending: post.trending,
		topPost: post.topPost,
		isPromo: post.isPromo,
		author_name: post.author_name,
		author_desg: post.author_desg,
		author_img: post.author_img,
		author_bio: post.author_bio,
		featureImg: post.featureImg,
		thumb: post.thumb,
		excerpt: post.excerpt,
		date: post.date,
	};
}

export function toIsoDate(value) {
	if (!value) return null;
	if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
		const d = new Date(value);
		return Number.isNaN(d.getTime()) ? null : d.toISOString();
	}
	const d = new Date(value);
	return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default validateFrontmatter;
