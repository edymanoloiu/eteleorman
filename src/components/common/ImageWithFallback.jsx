'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import {
	LOCAL_AVATAR_FALLBACK,
	LOCAL_IMAGE_FALLBACK,
} from '../../../lib/imageFallback';

function initialSrc(src, fallbackSrc) {
	const t = src == null ? '' : String(src).trim();
	return t || fallbackSrc;
}

export default function ImageWithFallback({
	src,
	fallbackSrc = LOCAL_IMAGE_FALLBACK,
	alt,
	onError,
	...props
}) {
	const [imgSrc, setImgSrc] = useState(() => initialSrc(src, fallbackSrc));
	const [swapUsed, setSwapUsed] = useState(false);

	useEffect(() => {
		setImgSrc(initialSrc(src, fallbackSrc));
		setSwapUsed(false);
	}, [src, fallbackSrc]);

	const handleError = useCallback(
		(e) => {
			if (swapUsed || imgSrc === fallbackSrc) {
				onError?.(e);
				return;
			}
			setSwapUsed(true);
			setImgSrc(fallbackSrc);
			onError?.(e);
		},
		[swapUsed, imgSrc, fallbackSrc, onError]
	);

	return (
		<Image src={imgSrc} alt={alt ?? ''} onError={handleError} {...props} />
	);
}
