#!/usr/bin/env node
/**
 * Featured image audit (source-level; does not download remote dimensions by default).
 * npm run seo:images
 */
const fs = require('fs');
const path = require('path');
const { loadAllArticles, loadPublication, writeReport, severityCount, ROOT } = require('./seo/lib');

function main() {
	const pub = loadPublication();
	const articles = loadAllArticles();
	const issues = [];
	const imageUsage = new Map();

	for (const a of articles) {
		const img = (a.featureImg || '').trim();
		if (!img) {
			issues.push({ severity: 'high', code: 'missing_featured_image', slug: a.slug, file: a.file });
			continue;
		}

		if (!imageUsage.has(img)) imageUsage.set(img, []);
		imageUsage.get(img).push(a.slug);

		if (img.startsWith('/')) {
			const local = path.join(ROOT, 'public', img.replace(/^\//, ''));
			if (!fs.existsSync(local)) {
				issues.push({
					severity: 'high',
					code: 'local_image_missing',
					slug: a.slug,
					image: img,
					file: a.file,
				});
			}
		} else if (!/^https:\/\//i.test(img)) {
			issues.push({
				severity: 'medium',
				code: 'non_https_image',
				slug: a.slug,
				image: img,
				file: a.file,
			});
		}
	}

	for (const [image, slugs] of imageUsage) {
		if (slugs.length >= 8) {
			issues.push({
				severity: 'medium',
				code: 'heavy_image_reuse',
				image,
				count: slugs.length,
				sampleSlugs: slugs.slice(0, 8),
			});
		}
	}

	const report = {
		generatedAt: new Date().toISOString(),
		domain: pub.canonicalDomain,
		articleCount: articles.length,
		note:
			'Remote image pixel dimensions are not measured here. Use Discover readiness checks in production tooling when needed. Do not upscale low-resolution images.',
		summary: severityCount(issues),
		issues,
	};
	const out = writeReport('seo-images.json', report);
	console.log(`seo:images → ${issues.length} issues → ${out}`);
}

main();
