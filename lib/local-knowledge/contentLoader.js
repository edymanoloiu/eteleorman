import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { CONTENT_TYPES, EVERGREEN_DIRS } from './contentTypes.js';
import { validateFrontmatter, normalizeLegacyNews, toIsoDate } from './schema.js';
import publication from '../../src/data/publication.js';
import { PUBLISHED_EVERGREEN as GENERATED_PUBLISHED } from './evergreen.generated.js';

const root = () => process.cwd();

function listMarkdown(dir) {
	const abs = path.join(root(), dir);
	if (!fs.existsSync(abs)) return [];
	return fs
		.readdirSync(abs)
		.filter((f) => f.endsWith('.md'))
		.map((f) => path.join(abs, f));
}

function canReadLocalEvergreen() {
	try {
		return Object.values(CONTENT_TYPES).some((typeMeta) => {
			if (typeMeta.id === 'news') return false;
			const abs = path.join(root(), typeMeta.dir);
			return fs.existsSync(abs) && fs.readdirSync(abs).some((f) => f.endsWith('.md'));
		});
	} catch {
		return false;
	}
}

/**
 * Încarcă toate documentele evergreen din content/.
 * Doar status=published sunt returnate în modul public (implicit).
 * Pe Cloudflare, content/ nu e disponibil la runtime — folosim modulul generat la build.
 */
export function loadEvergreenDocuments({ includeNonPublished = false } = {}) {
	if (!includeNonPublished && Array.isArray(GENERATED_PUBLISHED) && GENERATED_PUBLISHED.length > 0) {
		if (!canReadLocalEvergreen()) {
			return { docs: GENERATED_PUBLISHED.slice(), errors: [] };
		}
	}

	const docs = [];
	const errors = [];

	for (const typeMeta of Object.values(CONTENT_TYPES)) {
		if (typeMeta.id === 'news') continue;
		for (const filePath of listMarkdown(typeMeta.dir)) {
			const raw = fs.readFileSync(filePath, 'utf8');
			const { data, content } = matter(raw);
			const slug = data.slug || path.basename(filePath, '.md');
			const doc = {
				...data,
				slug,
				contentType: data.contentType || typeMeta.id,
				body: content,
				filePath: path.relative(root(), filePath),
			};

			const validation = validateFrontmatter(doc);
			if (!validation.ok) {
				errors.push({ file: doc.filePath, errors: validation.errors });
				continue;
			}

			if (!includeNonPublished && doc.status !== 'published') continue;
			docs.push(doc);
		}
	}

	// Fallback when content/ is missing at runtime (OpenNext/Cloudflare worker).
	if (!docs.length && !includeNonPublished && Array.isArray(GENERATED_PUBLISHED)) {
		return { docs: GENERATED_PUBLISHED.slice(), errors };
	}

	return { docs, errors };
}

export function loadPublishedEvergreen() {
	return loadEvergreenDocuments({ includeNonPublished: false }).docs;
}

export function getEvergreenBySlug(contentType, slug) {
	const fromFs = (() => {
		const meta = CONTENT_TYPES[contentType];
		if (!meta || meta.id === 'news') return null;
		const filePath = path.join(root(), meta.dir, `${slug}.md`);
		if (fs.existsSync(filePath)) {
			const raw = fs.readFileSync(filePath, 'utf8');
			const { data, content } = matter(raw);
			if (data.status !== 'published') return null;
			return {
				...data,
				slug: data.slug || slug,
				contentType: data.contentType || contentType,
				body: content,
			};
		}
		for (const fp of listMarkdown(meta.dir)) {
			const raw = fs.readFileSync(fp, 'utf8');
			const { data, content } = matter(raw);
			if ((data.slug || path.basename(fp, '.md')) === slug) {
				if (data.status !== 'published') return null;
				return { ...data, slug, contentType: data.contentType || contentType, body: content };
			}
		}
		return null;
	})();

	if (fromFs) return fromFs;

	const generated = (GENERATED_PUBLISHED || []).find(
		(d) => d.contentType === contentType && d.slug === slug && d.status === 'published'
	);
	return generated || null;
}

export function listEvergreenSlugs(contentType) {
	const meta = CONTENT_TYPES[contentType];
	if (!meta || meta.id === 'news') return [];

	if (canReadLocalEvergreen()) {
		return listMarkdown(meta.dir)
			.map((fp) => {
				const raw = fs.readFileSync(fp, 'utf8');
				const { data } = matter(raw);
				if (data.status !== 'published') return null;
				return data.slug || path.basename(fp, '.md');
			})
			.filter(Boolean);
	}

	return (GENERATED_PUBLISHED || [])
		.filter((d) => d.contentType === contentType && d.status === 'published')
		.map((d) => d.slug);
}

export function normalizeNewsList(posts) {
	return (posts || []).map((p) => normalizeLegacyNews(p, publication));
}

export { toIsoDate, EVERGREEN_DIRS };
export default loadEvergreenDocuments;
