import fs from 'fs';
import path from 'path';
import { getAllPosts } from './api.js';
import { loadPublishedEvergreen } from './local-knowledge/contentLoader.js';
import { isRecomandarePost } from './recomandarePosts.js';

const NEWS_WINDOW_MS = 1000 * 60 * 60 * 24 * 2;
const ARTICLE_WINDOW_MS = 1000 * 60 * 60 * 24 * 90;

const GHIDURI_TYPES = new Set(['guide', 'service', 'explainer']);
const ENTITATI_TYPES = new Set(['place', 'institution', 'person', 'organization']);

function safeDateMs(dateValue) {
	if (!dateValue) return null;
	const t = new Date(dateValue).getTime();
	return Number.isNaN(t) ? null : t;
}

function countNewsPosts() {
	const cutoff = Date.now() - NEWS_WINDOW_MS;
	return getAllPosts(['slug', 'date', 'title', 'tags']).filter((p) => {
		if (!p?.slug || !p?.title || isRecomandarePost(p)) return false;
		const t = safeDateMs(p.date);
		if (t == null || t > Date.now() + 60 * 60 * 1000) return false;
		return t >= cutoff;
	}).length;
}

function countRecentArticles() {
	const cutoff = Date.now() - ARTICLE_WINDOW_MS;
	return getAllPosts(['slug', 'date']).filter((p) => {
		const t = safeDateMs(p.date);
		return p?.slug && t != null && t >= cutoff;
	}).length;
}

function countEvergreen(types) {
	return loadPublishedEvergreen().filter((d) => types.has(d.contentType)).length;
}

function readBuildManifestFeeds() {
	const manifestPath = path.join(process.cwd(), 'public', 'sitemaps', 'manifest.json');
	if (!fs.existsSync(manifestPath)) return [];
	try {
		const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
		return Array.isArray(manifest.feeds) ? manifest.feeds : [];
	} catch {
		return [];
	}
}

/** Sitemap filenames to include in sitemap-index.xml (non-empty feeds only). */
export function getActiveSitemapFeeds() {
	const built = readBuildManifestFeeds();
	if (built.length > 0) {
		const feeds = built.filter((f) => f !== 'news-sitemap.xml');
		if (countRecentArticles() > 0 && !feeds.includes('sitemap-articole.xml')) {
			feeds.push('sitemap-articole.xml');
		}
		if (countNewsPosts() > 0) feeds.push('news-sitemap.xml');
		if (countEvergreen(GHIDURI_TYPES) > 0 && !feeds.includes('sitemap-ghiduri.xml')) feeds.push('sitemap-ghiduri.xml');
		if (countEvergreen(ENTITATI_TYPES) > 0 && !feeds.includes('sitemap-entitati.xml')) feeds.push('sitemap-entitati.xml');
		if (countEvergreen(new Set(['event'])) > 0 && !feeds.includes('sitemap-evenimente.xml')) feeds.push('sitemap-evenimente.xml');
		return feeds;
	}

	// Fallback before first build-time generation.
	const feeds = [];
	if (countRecentArticles() > 0) feeds.push('sitemap-articole.xml');
	if (countNewsPosts() > 0) feeds.push('news-sitemap.xml');
	if (countEvergreen(GHIDURI_TYPES) > 0) feeds.push('sitemap-ghiduri.xml');
	if (countEvergreen(ENTITATI_TYPES) > 0) feeds.push('sitemap-entitati.xml');
	if (countEvergreen(new Set(['event'])) > 0) feeds.push('sitemap-evenimente.xml');
	return feeds;
}
