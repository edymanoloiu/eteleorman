#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const issues = [];

function need(file, label) {
	if (!fs.existsSync(path.join(ROOT, file))) issues.push(`Lipsește ${label}: ${file}`);
}

need('src/data/publication.js', 'configurație publicație');
need('public/robots.txt', 'robots.txt');
need('lib/local-knowledge/contentTypes.js', 'tipuri conținut');
need('src/pages/ghidul-orasului/index.js', 'hub ghiduri');
need('src/pages/sitemap-ghiduri.xml.js', 'sitemap ghiduri');
need('src/pages/sitemap-entitati.xml.js', 'sitemap entități');

const pubPath = path.join(ROOT, 'src/data/publication.js');
if (fs.existsSync(pubPath)) {
	const t = fs.readFileSync(pubPath, 'utf8');
	if (!/canonicalDomain:\s*['"]https:\/\//.test(t)) issues.push('canonicalDomain invalid în publication.js');
	if (/TODO_FILL/.test(t)) issues.push('publication.js conține TODO_FILL — completați datele reale');
}

const robots = fs.existsSync(path.join(ROOT, 'public/robots.txt'))
	? fs.readFileSync(path.join(ROOT, 'public/robots.txt'), 'utf8')
	: '';
if (robots && !/sitemap/i.test(robots)) issues.push('robots.txt nu declară sitemap');

console.log(issues.length ? issues.map((i) => `✖ ${i}`).join('\n') : '✔ seo:check OK');
fs.mkdirSync(path.join(ROOT, 'reports'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'reports', 'seo-check.json'), JSON.stringify({ issues }, null, 2));
if (issues.length) process.exit(1);
