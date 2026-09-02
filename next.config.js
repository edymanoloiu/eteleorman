import path from 'path';

const srcAlias = path.resolve(process.cwd(), 'src');
const onVercel = Boolean(process.env.VERCEL);

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	basePath: process.env.NODE_ENV === 'production' ? (process.env.NEXT_PUBLIC_BASEPATH || "") : "",
	// Public images/posts must stay on the CDN only — NFT was packing ~2100 images into
	// every lambda (~200MB × 60) which stalls Vercel "Deploying outputs".
	outputFileTracingExcludes: {
		'*': [
			'./lib/postsIndex.json',
			'./lib/postsBodies.json',
			'./content-data/**/*',
			'./posts/**/*',
			'./docs/**/*',
			'./tests/**/*',
			'./reports/**/*',
			'./public/_posts/**/*',
			'./public/_evergreen/**/*',
			'./public/images/posts/**/*',
			'./public/posts-index.json',
			'./public/posts-bodies.json',
			'./public/search-index.json',
			'./public/evergreen-index.json',
			'./node_modules/@next/swc-linux-x64-musl/**/*',
			'./node_modules/@swc/core-linux-x64-musl/**/*',
		],
	},
	turbopack: {
		resolveAlias: {
			'@': srcAlias,
		},
	},
	webpack(config) {
		config.resolve.fallback = { fs: false };
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'@': srcAlias,
		};
		// Avoid giant webpack filesystem cache packs on Vercel (ENOSPC during deploy).
		if (onVercel) {
			config.cache = false;
		}
		return config;
	},
	trailingSlash: true,
	images: {
		unoptimized: true,
		remotePatterns: [
			{ protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'upload.wikimedia.org', pathname: '/**' },
			{ protocol: 'https', hostname: 'obliqdesign.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'meritasamergi.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'ghidullegal.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'sfaturidesanatate.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'ghidulgospodarului.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'azicemancam.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'cautimasina.ro', pathname: '/**' },
			{ protocol: 'https', hostname: 'painesicirc.ro', pathname: '/**' },
		],
	}
};

export default nextConfig;
