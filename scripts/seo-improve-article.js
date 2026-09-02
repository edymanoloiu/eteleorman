#!/usr/bin/env node
/**
 * Optional editorial improvement checklist for a single article.
 * Does NOT rewrite the article by default — prints a structured plan.
 *
 * Usage:
 *   npm run seo:improve -- --slug=my-article-slug
 *   npm run seo:improve -- --slug=my-article-slug --apply-frontmatter-only
 *
 * Safety: never invents facts; never mass-runs; preserves publication date.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { POSTS_DIR, normalizeText, writeReport } = require('./seo/lib');

function parseArgs(argv) {
	const out = { slug: null, applyFrontmatterOnly: false };
	for (const arg of argv) {
		if (arg.startsWith('--slug=')) out.slug = arg.slice('--slug='.length);
		if (arg === '--apply-frontmatter-only') out.applyFrontmatterOnly = true;
	}
	return out;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.slug) {
		console.error('Usage: npm run seo:improve -- --slug=article-slug [--apply-frontmatter-only]');
		process.exit(1);
	}

	const file = path.join(POSTS_DIR, `${args.slug}.md`);
	if (!fs.existsSync(file)) {
		console.error(`Article not found: ${file}`);
		process.exit(1);
	}

	const raw = fs.readFileSync(file, 'utf8');
	const parsed = matter(raw);
	const plain = normalizeText(parsed.content);
	const words = plain.split(/\s+/).filter(Boolean).length;

	const plan = {
		slug: args.slug,
		title: parsed.data.title || null,
		publicationDate: parsed.data.date || null,
		preservePublicationDate: true,
		primaryIntentGuess: parsed.data.title || 'unknown — set editorially',
		checks: {
			hasTitle: Boolean(parsed.data.title),
			hasExcerpt: Boolean(parsed.data.excerpt),
			hasImage: Boolean(parsed.data.featureImg || parsed.data.thumb),
			hasAuthor: Boolean(parsed.data.author_name),
			wordCount: words,
			hasInternalMarkdownLinks: /\]\(\//.test(parsed.content || ''),
			headingCount: (parsed.content.match(/^##?\s+/gm) || []).length,
		},
		actions: [
			'Identify the primary search intent from the title and first paragraph.',
			'Preserve correct, unique local facts; do not invent statistics, quotes, prices, or institutions.',
			'Remove empty boilerplate and repeated introductions/conclusions.',
			'Ensure the introduction answers the reader query quickly.',
			'Fix heading hierarchy (single H1 via title; body uses H2/H3).',
			'Add direct answers to likely reader questions when source-backed.',
			'Add genuinely useful local context and relevant internal links only.',
			'Correct title/description only when unclear or duplicated.',
			'Preserve the original URL and publication date.',
			'Set dateModified only if a substantive edit is made.',
			'Mark claims needing verification instead of hallucinating.',
		],
		warnings: [],
	};

	if (words < 120) plan.warnings.push('Thin content — expand only with verified information.');
	if (!parsed.data.excerpt) plan.warnings.push('Missing excerpt/description.');
	if (!parsed.data.featureImg) plan.warnings.push('Missing featured image.');

	if (args.applyFrontmatterOnly) {
		let changed = false;
		if (!parsed.data.excerpt && plain) {
			parsed.data.excerpt = plain.slice(0, 180).trim();
			changed = true;
		}
		if (changed) {
			const next = matter.stringify(parsed.content, parsed.data);
			fs.writeFileSync(file, next);
			plan.frontmatterUpdated = true;
			plan.warnings.push('Excerpt auto-filled from body start — review editorially.');
		} else {
			plan.frontmatterUpdated = false;
		}
	}

	const out = writeReport(`seo-improve-${args.slug}.json`, plan);
	console.log(JSON.stringify(plan, null, 2));
	console.log(`Wrote ${out}`);
}

main();
