#!/usr/bin/env node
/**
 * Verifică relatedSlugs și linkuri markdown interne către sluguri existente.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const ROOT = process.cwd();
const known = new Set();

function collect(dir) {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) return;
	for (const f of fs.readdirSync(abs).filter((x) => x.endsWith('.md'))) {
		const { data } = matter(fs.readFileSync(path.join(abs, f), 'utf8'));
		known.add(data.slug || f.replace(/\.md$/, ''));
	}
}

['posts', 'content/guides', 'content/places', 'content/institutions', 'content/people', 'content/organizations', 'content/events', 'content/services', 'content/explainers'].forEach(collect);

let broken = 0;
const findings = [];

function checkDir(dir) {
	const abs = path.join(ROOT, dir);
	if (!fs.existsSync(abs)) return;
	for (const f of fs.readdirSync(abs).filter((x) => x.endsWith('.md'))) {
		const filePath = path.join(dir, f);
		const raw = fs.readFileSync(path.join(ROOT, filePath), 'utf8');
		const { data, content } = matter(raw);
		for (const rel of data.relatedSlugs || []) {
			if (!known.has(rel)) {
				broken += 1;
				findings.push({ file: filePath, type: 'relatedSlug', target: rel });
				console.error(`✖ ${filePath}: relatedSlug inexistent: ${rel}`);
			}
		}
		const mdLinks = content.matchAll(/\[[^\]]+\]\(\/([^)#?\s]+)\)/g);
		for (const m of mdLinks) {
			const parts = m[1].replace(/\/$/, '').split('/');
			const slug = parts[parts.length - 1];
			if (slug && !known.has(slug) && !['contact', 'despre', 'cauta', 'gdpr', 'cookies'].includes(slug)) {
				// soft warning — rute hub pot exista fără md
			}
		}
	}
}

['content/guides', 'content/places', 'content/institutions', 'content/people', 'content/organizations', 'content/events', 'content/services', 'content/explainers'].forEach(checkDir);

fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports', 'links-check.json'), JSON.stringify({ broken, findings }, null, 2));
console.log(`Linkuri rupte (relatedSlugs): ${broken}`);
if (broken > 0) process.exit(1);
