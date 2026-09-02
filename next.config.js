import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	basePath: process.env.NODE_ENV === 'production' ? process.env.NEXT_PUBLIC_BASEPATH : "",
	webpack(config) {
		config.resolve.fallback = { fs: false };
		config.resolve.alias = {
			...(config.resolve.alias || {}),
			'@': path.resolve(process.cwd(), 'src'),
		};
		return config;
	},
	turbopack: {
		resolveAlias: {
			'@': path.resolve(process.cwd(), 'src'),
		},
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