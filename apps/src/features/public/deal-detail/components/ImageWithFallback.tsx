'use client';

import { cn } from '@/lib/utils';
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
        <div className="relative flex h-full items-center">
            <Image
                src={imgSrc}
                alt={alt}
                width={320}
                height={320}
                className={cn('w-full max-h-full object-cover', className)}
                onError={() => setImgSrc(fallback)}
            />
        </div>
    );
}
