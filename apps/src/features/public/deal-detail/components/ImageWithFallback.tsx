'use client';

import Image from 'next/image';
import { useState } from 'react';

type Props = {
    src?: string | null;
    alt: string;
    fallback?: string;
    className?: string;
};

export default function ImageWithFallback({ src, alt, fallback = '/image.png', className }: Props) {
    const [imgSrc, setImgSrc] = useState(src || fallback);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            width={400}
            height={400}
            className={className}
            onError={() => setImgSrc(fallback)}
        />
    );
}
