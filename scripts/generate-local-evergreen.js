#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const CONTENT_DIR = fs.existsSync(path.join(ROOT, 'posts')) ? 'posts' : 'content';
const TODAY = new Date();
const ISO_NOW = TODAY.toISOString();
const DATE_LABEL = TODAY.toISOString().slice(0, 10);
const MONTH = TODAY.getMonth() + 1;

function readJson(relativePath, fallback = null) {
	const fullPath = path.join(ROOT, relativePath);
	if (!fs.existsSync(fullPath)) return fallback;
	return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
}

function writeJson(relativePath, data) {
	const fullPath = path.join(ROOT, relativePath);
	fs.mkdirSync(path.dirname(fullPath), { recursive: true });
	fs.writeFileSync(fullPath, `${JSON.stringify(data, null, 2)}\n`);
}

function slugify(value) {
	return String(value)
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.toLowerCase()
		.replace(/ă/g, 'a')
		.replace(/â/g, 'a')
		.replace(/î/g, 'i')
		.replace(/ș|ş/g, 's')
		.replace(/ț|ţ/g, 't')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

function parseArgs(argv) {
	const args = { limit: 5, dryRun: false, report: false, update: false };
	for (const arg of argv) {
		if (arg === '--dry-run') args.dryRun = true;
		else if (arg === '--report') args.report = true;
		else if (arg === '--update') args.update = true;
		else if (arg.startsWith('--city=')) args.city = slugify(arg.slice('--city='.length));
		else if (arg.startsWith('--template=')) args.template = arg.slice('--template='.length);
		else if (arg.startsWith('--limit=')) args.limit = Number(arg.slice('--limit='.length));
	}
	return args;
}

function getByPath(source, dottedPath) {
	return dottedPath.split('.').reduce((acc, key) => (acc ? acc[key] : undefined), source);
}

function hasRequiredData(cityKnowledge, template) {
	return template.required_city_data.every((key) => {
		const value = getByPath(cityKnowledge, key);
		return Array.isArray(value) ? value.length > 0 : Boolean(value);
	});
}

function existingPostSlugs() {
	const postsDir = path.join(ROOT, CONTENT_DIR);
	if (!fs.existsSync(postsDir)) return new Set();
	return new Set(
		fs.readdirSync(postsDir)
			.filter((file) => file.endsWith('.md'))
			.map((file) => file.replace(/\.md$/, ''))
	);
}

function sourceHash(cityKnowledge, template) {
	return crypto
		.createHash('sha256')
		.update(JSON.stringify({ template, city: cityKnowledge.city, sources: cityKnowledge.sources }))
		.digest('hex');
}

function contentHash(content) {
	return crypto.createHash('sha256').update(content).digest('hex');
}

function formatRoDate(date) {
	return date.toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });
}

function sourceList(cityKnowledge, template) {
	const lowerNeedles = template.required_sources.map((item) => item.replace(/^www\./, '').toLowerCase());
	return (cityKnowledge.sources || []).filter((source) =>
		lowerNeedles.some((needle) => source.url.toLowerCase().includes(needle) || source.name.toLowerCase().includes(needle.split('.')[0]))
	);
}

function categoryLabel(category) {
	const map = {
		'sanatate': 'Sănătate',
		'trafic-si-transport': 'Trafic si transport',
		'timp-liber': 'Timp liber',
		'administratie-locala': 'Administratie locala'
	};
	return map[category] || 'Azi in Bucuresti';
}

function buildArticleBody(city, cityKnowledge, template, sources) {
	const updated = formatRoDate(TODAY);
	if (template.id === 'spitale-bucuresti') {
		const hospitals = cityKnowledge.health.hospitals;
		return `# ${template.title_template.replace('{city}', city.city)}

Bucureștiul are spitale publice și clinici de urgență care trebuie verificate direct în sursele oficiale înainte de vizită sau programare. Lista de mai jos pornește de la instituții și surse oficiale, dar programul, secțiile disponibile și datele de contact se pot modifica.

## Răspuns rapid

Pentru urgențe, cititorii trebuie să folosească numărul unic 112 sau informațiile publicate de spitale și de autoritățile medicale. Pentru consultații, internări sau programări, verificarea pe site-ul fiecărui spital rămâne obligatorie.

## Lista spitalelor incluse pentru verificare editorială

${hospitals.map((hospital) => `### ${hospital.name}\n\n- Sursă de verificare: ${hospital.source}\n- Date dinamice: secții, programări, telefoane, gardă și acces. Acestea trebuie reverificate înainte de publicare.\n- Observație editorială: nu prezenta serviciile ca disponibile fără confirmare pe site-ul instituției sau într-o comunicare oficială recentă.`).join('\n\n')}

## Ce trebuie verificat înainte de publicare

- dacă unitatea are primiri urgențe sau doar ambulatoriu;
- adresa oficială și eventualele sedii secundare;
- specializările active;
- programările, telefoanele și restricțiile temporare;
- apartenența administrativă, acolo unde contează pentru cititor.

## Surse și data actualizării

${sources.map((source) => `- ${source.name}: ${source.url}`).join('\n')}

Ultima actualizare editorială: ${updated}.`;
	}

	if (template.id === 'transport-public-bucuresti') {
		const operators = cityKnowledge.transport.operators;
		return `# ${template.title_template.replace('{city}', city.city)}

Transportul public din București este operat prin rețeaua de suprafață, metrou și coordonare metropolitană. Tarifele, traseele și orarele sunt informații dinamice, deci articolul trebuie actualizat din sursele operatorilor înainte de publicare.

## Răspuns rapid

Pentru bilete, abonamente, trasee și modificări temporare, cititorii trebuie trimiși către STB, Metrorex și TPBI. O variantă editorială publicabilă trebuie să precizeze data verificării tarifelor și a traseelor.

## Operatorii care trebuie verificați

${operators.map((operator) => `### ${operator.name}\n\n- Site oficial: ${operator.source}\n- Date dinamice: tarife, titluri de călătorie, trasee, orare, devieri și restricții.\n- Frecvență de verificare: înainte de fiecare republicare sau actualizare.`).join('\n\n')}

## Ce trebuie verificat înainte de publicare

- prețul actual al biletelor și abonamentelor;
- valabilitatea titlurilor integrate;
- traseele modificate temporar;
- legătura dintre metrou, transportul de suprafață și liniile metropolitane;
- eventualele restricții sau lucrări care schimbă accesul la stații.

## Linkuri interne recomandate

- /trafic-si-transport/
- /servicii-publice/
- /ghidul-orasului/

## Surse și data actualizării

${sources.map((source) => `- ${source.name}: ${source.url}`).join('\n')}

Ultima actualizare editorială: ${updated}.`;
	}

	return `# ${template.title_template.replace('{city}', city.city)}

Acest articol a fost selectat pentru generare, dar are nevoie de completare editorială înainte de publicare.

## Surse și data actualizării

${sources.map((source) => `- ${source.name}: ${source.url}`).join('\n')}

Ultima actualizare editorială: ${updated}.`;
}

function scoreArticle(template, sources, body) {
	let score = 55;
	if (sources.length >= 2) score += 15;
	if (body.includes('## Răspuns rapid')) score += 10;
	if (body.includes('Ce trebuie verificat')) score += 10;
	if (template.editorial_risk === 'low') score += 5;
	if (template.content_type.includes('dynamic')) score -= 5;
	return Math.max(0, Math.min(100, score));
}

function yamlValue(value) {
	if (Array.isArray(value)) return `[${value.map((item) => JSON.stringify(item)).join(', ')}]`;
	if (typeof value === 'number') return String(value);
	return JSON.stringify(value);
}

function buildMarkdown(city, template, slug, body, sources, score) {
	const title = template.title_template.replace('{city}', city.city);
	const description = `${title}. Ghid local cu surse oficiale și informații marcate pentru verificare editorială.`;
	const frontmatter = {
		postFormat: 'text',
		trending: false,
		title,
		slug,
		description,
		excerpt: description.slice(0, 155),
		featureImg: '/images/logo.png',
		thumb: '/images/logo.png',
		date: DATE_LABEL,
		dateModified: DATE_LABEL,
		cate: categoryLabel(template.category),
		cate_bg: 'bg-color-red-one',
		cate_img: '/images/category/world.png',
		post_views: '0 Vizualizari',
		post_share: '0 Shares',
		author_name: 'Redacția',
		author_desg: 'Redacție',
		author_img: '/images/author/radu.png',
		tags: ['București', categoryLabel(template.category), 'Ghid local'],
		city: city.city,
		county: city.county,
		publication: city.publication,
		primaryKeyword: slug.replace(/-/g, ' '),
		secondaryKeywords: [template.category, city.city],
		contentType: template.content_type,
		year: 2026,
		reviewStatus: score >= 90 ? 'ready' : 'needs-review',
		dataVerifiedAt: DATE_LABEL,
		nextReviewAt: new Date(TODAY.getTime() + 1000 * 60 * 60 * 24 * 120).toISOString().slice(0, 10),
		editorialQualityScore: score,
		sources: sources.map((source) => source.url)
	};
	const yaml = Object.entries(frontmatter).map(([key, value]) => `${key}: ${yamlValue(value)}`).join('\n');
	return `---\n${yaml}\n---\n\n${body}\n`;
}

function main() {
	const args = parseArgs(process.argv.slice(2));
	const publications = readJson('data/local-evergreen/publications.json', []);
	const templates = readJson('data/local-evergreen/templates.json', []);
	const registry = readJson('data/generated-local-articles.json', []);
	const existingSlugs = existingPostSlugs();
	const rows = [];
	const created = [];
	const skipped = [];

	for (const city of publications) {
		if (args.city && args.city !== city.slug) continue;
		const cityKnowledge = readJson(city.knowledge_file);
		if (!cityKnowledge) {
			skipped.push({ city: city.city, reason: 'missing_knowledge_file', file: city.knowledge_file });
			continue;
		}
		const candidates = templates
			.filter((template) => !args.template || template.id === args.template)
			.filter((template) => hasRequiredData(cityKnowledge, template))
			.map((template) => ({ template, season: template.seasonality.includes(MONTH) ? 20 : 0 }))
			.sort((a, b) => (b.template.priority + b.season) - (a.template.priority + a.season))
			.slice(0, args.limit);

		for (const { template } of candidates) {
			const title = template.title_template.replace('{city}', city.city);
			const slug = template.slug_template.replace('{city_slug}', city.slug);
			const duplicate = registry.find((item) => item.publication === city.publication && item.template_id === template.id) || existingSlugs.has(slug);
			if (duplicate && !args.update) {
				skipped.push({ city: city.city, template: template.id, title, slug, reason: 'duplicate_or_already_registered' });
				continue;
			}
			const sources = sourceList(cityKnowledge, template);
			if (sources.length === 0) {
				skipped.push({ city: city.city, template: template.id, title, slug, reason: 'insufficient_sources' });
				continue;
			}
			const body = buildArticleBody(city, cityKnowledge, template, sources);
			const score = scoreArticle(template, sources, body);
			if (score < 75) {
				skipped.push({ city: city.city, template: template.id, title, slug, reason: 'quality_score_below_75', score });
				continue;
			}
			const markdown = buildMarkdown(city, template, slug, body, sources, score);
			const filePath = `${CONTENT_DIR}/${slug}.md`;
			const entry = {
				id: `${city.slug}:${template.id}`,
				city: city.city,
				publication: city.publication,
				template_id: template.id,
				title,
				slug,
				category: template.category,
				primary_keyword: slug.replace(/-/g, ' '),
				content_type: template.content_type,
				status: args.dryRun ? 'dry-run' : 'generated',
				generated_at: ISO_NOW,
				last_updated_at: ISO_NOW,
				next_review_at: new Date(TODAY.getTime() + 1000 * 60 * 60 * 24 * 120).toISOString(),
				source_hash: sourceHash(cityKnowledge, template),
				content_hash: contentHash(markdown),
				file_path: filePath,
				score,
				sources
			};
			rows.push(entry);
			if (!args.dryRun) {
				fs.writeFileSync(path.join(ROOT, filePath), markdown);
				const index = registry.findIndex((item) => item.id === entry.id);
				if (index >= 0) registry[index] = entry;
				else registry.push(entry);
			}
			created.push(entry);
		}
	}

	if (!args.dryRun) writeJson('data/generated-local-articles.json', registry);
	const reportPath = `reports/local-evergreen-generation-${DATE_LABEL}.md`;
	const report = [
		`# Raport generare local evergreen - ${DATE_LABEL}`,
		'',
		`Mod: ${args.dryRun ? 'dry-run' : 'write'}`,
		'',
		'## Articole create sau selectate',
		created.length ? created.map((item) => `- ${item.title} (${item.score}/100) - ${item.file_path}`).join('\n') : '- Niciun articol.',
		'',
		'## Articole sărite',
		skipped.length ? skipped.map((item) => `- ${item.title || item.city}: ${item.reason}`).join('\n') : '- Niciun articol sărit.',
		'',
		'## Surse folosite',
		rows.flatMap((item) => item.sources.map((source) => `- ${item.title}: ${source.name} - ${source.url}`)).join('\n') || '- Nicio sursă folosită.',
		'',
		'## Observații',
		'- Articolele generate automat sunt marcate `needs-review` dacă scorul este sub 90.',
		'- Tarifele, programele, traseele, secțiile și telefoanele sunt tratate ca date dinamice și trebuie reverificate înainte de publicare.'
	].join('\n');
	if (!args.dryRun || args.report) {
		fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
		fs.writeFileSync(path.join(ROOT, reportPath), `${report}\n`);
	}
	console.log(JSON.stringify({ created: created.length, skipped: skipped.length, reportPath, dryRun: args.dryRun }, null, 2));
}

if (require.main === module) main();

module.exports = { slugify, parseArgs, hasRequiredData, scoreArticle };
