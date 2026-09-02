#!/usr/bin/env node
/**
 * Optional Google Search Console helpers (sitemap submit / list).
 * Requires GOOGLE_APPLICATION_CREDENTIALS or OAuth env vars — never commit secrets.
 *
 * npm run gsc:sitemap-list
 * npm run gsc:sitemap-submit
 */
const fs = require('fs');
const path = require('path');

function loadEnvExampleHint() {
	const example = path.join(process.cwd(), '.env.example');
	if (fs.existsSync(example)) return fs.readFileSync(example, 'utf8');
	return '';
}

async function main() {
	const action = process.argv[2] || 'help';
	const siteUrl = process.env.GSC_SITE_URL || 'https://eteleorman.ro/';

	if (action === 'help' || action === '--help') {
		console.log(`GSC helpers for ${siteUrl}
Set env from .env.example (GSC_SITE_URL, GOOGLE_APPLICATION_CREDENTIALS).
Commands:
  node scripts/gsc/sitemaps.js list
  node scripts/gsc/sitemaps.js submit
See GSC_SETUP.md for credential setup.
Do not use the Indexing API for ordinary editorial URLs.
Do not call the retired sitemap ping endpoint.`);
		return;
	}

	let google;
	try {
		google = require('googleapis').google;
	} catch {
		console.error(
			'Missing dependency: googleapis. Install with `npm i googleapis` when you are ready to use GSC API scripts.'
		);
		console.error(loadEnvExampleHint());
		process.exit(1);
	}

	const auth = new google.auth.GoogleAuth({
		scopes: ['https://www.googleapis.com/auth/webmasters'],
	});
	const searchconsole = google.searchconsole({ version: 'v1', auth });

	if (action === 'list') {
		const res = await searchconsole.sitemaps.list({ siteUrl });
		console.log(JSON.stringify(res.data, null, 2));
		return;
	}

	if (action === 'submit') {
		const sitemapUrl = process.env.GSC_SITEMAP_URL || `${siteUrl.replace(/\/$/, '')}/sitemap-index.xml`;
		const res = await searchconsole.sitemaps.submit({ siteUrl, feedpath: sitemapUrl });
		console.log(`Submitted ${sitemapUrl}`);
		console.log(JSON.stringify(res.data || { ok: true }, null, 2));
		return;
	}

	console.error(`Unknown action: ${action}`);
	process.exit(1);
}

main().catch((err) => {
	console.error(err.message || err);
	process.exit(1);
});
