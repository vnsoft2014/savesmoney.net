'use client';

import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

type Props = {
    images: string[];
    alt: string;
    fallback?: string;
};

const VISIBLE_THUMBS = 7;

export default function DealImageSlider({ images, alt, fallback = '/image.png' }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
    const thumbNextRef = useRef<HTMLButtonElement>(null);
    const [isThumbEnd, setIsThumbEnd] = useState(false);

    const validImages = images?.length > 0 ? images : [fallback];

    // If only one image, render a simple image without slider
    if (validImages.length === 1) {
        return (
            <div className="relative flex h-full items-center">
                <Image
                    src={validImages[0]}
                    alt={alt}
                    width={800}
                    height={800}
                    className="w-full max-h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = fallback;
                    }}
                />
            </div>
        );
    }

    const showThumbNav = validImages.length > VISIBLE_THUMBS;

    return (
        <div className="deal-image-slider flex gap-2">
            {/* Vertical Thumbnails (left side) - Hidden on mobile */}
            <div
                className="deal-thumbs-column relative hidden md:flex flex-col items-center shrink-0"
                style={{ width: '64px' }}
            >
                {/* Vertical thumb swiper */}
                <div className="flex-1 w-full overflow-hidden" style={{ maxHeight: `${VISIBLE_THUMBS * 68}px` }}>
                    <Swiper
                        onSwiper={(swiper) => {
                            setThumbsSwiper(swiper);
                            setIsThumbEnd(swiper.isEnd);
                        }}
                        onSlideChange={(swiper) => {
                            setIsThumbEnd(swiper.isEnd);
                        }}
                        modules={[Thumbs, Navigation]}
                        direction="vertical"
                        spaceBetween={5}
                        slidesPerView={VISIBLE_THUMBS}
                        watchSlidesProgress
                        navigation={{
                            prevEl: '.deal-thumb-prev',
                            nextEl: '.deal-thumb-next',
                        }}
                        className="deal-thumbs-swiper"
                        style={{ height: `${VISIBLE_THUMBS * 68}px` }}
                    >
                        {validImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div
                                    className={cn(
                                        'cursor-pointer border-2 border-transparent rounded overflow-hidden',
                                        'hover:border-orange-400 transition-colors',
                                    )}
                                >
                                    <Image
                                        src={img}
                                        alt={`${alt} thumbnail ${index + 1}`}
                                        width={64}
                                        height={64}
                                        className="w-full aspect-square object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = fallback;
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Down arrow */}
                {showThumbNav && (
                    <button
                        ref={thumbNextRef}
                        className={cn(
                            'deal-thumb-next z-10 flex items-center justify-center w-full h-6 bg-white border border-gray-200 rounded transition-all',
                            isThumbEnd
                                ? 'opacity-0 pointer-events-none'
                                : 'opacity-100 hover:bg-gray-100 hover:border-gray-300 cursor-pointer',
                        )}
                        aria-label="Scroll thumbnails down"
                    >
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                )}
            </div>

            {/* Main slider (right side) */}
            <div className="flex-1 min-w-0">
                <Swiper
                    modules={[Navigation, Pagination, Thumbs]}
                    spaceBetween={2}
                    slidesPerView={1}
                    navigation={false}
                    pagination={{
                        clickable: true,
                    }}
                    thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                    className="deal-main-swiper"
                >
                    {validImages.map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="relative flex items-center justify-center aspect-square">
                                <Image
                                    src={img}
                                    alt={`${alt} - ${index + 1}`}
                                    width={800}
                                    height={800}
                                    className="w-full max-h-full object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = fallback;
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <style jsx global>{`
                .deal-main-swiper {
                    --swiper-navigation-size: 24px;
                    --swiper-navigation-color: #fff;
                    --swiper-pagination-color: #ea580c;
                    --swiper-pagination-bullet-inactive-color: #d1d5db;
                    --swiper-pagination-bullet-inactive-opacity: 0.6;
                }

                .deal-main-swiper .swiper-button-prev,
                .deal-main-swiper .swiper-button-next {
                    width: 32px;
                    height: 32px;
                    background: rgba(0, 0, 0, 0.4);
                    border-radius: 50%;
                    transition: background 0.2s;
                }

                .deal-main-swiper .swiper-button-prev:hover,
                .deal-main-swiper .swiper-button-next:hover {
                    background: rgba(0, 0, 0, 0.6);
                }

                .deal-main-swiper .swiper-pagination {
                    bottom: 6px !important;
                }

                @media (min-width: 768px) {
                    .deal-main-swiper .swiper-pagination {
                        display: none !important;
                    }
                }

                .deal-main-swiper .swiper-pagination-bullet {
                    width: 7px;
                    height: 7px;
                }

                .deal-thumbs-swiper {
                    width: 100%;
                }

                .deal-thumbs-swiper .swiper-slide {
                    height: auto !important;
                    opacity: 0.6;
                    transition: opacity 0.2s;
                }

                .deal-thumbs-swiper .swiper-slide-thumb-active {
                    opacity: 1;
                }

                .deal-thumbs-swiper .swiper-slide-thumb-active > div {
                    border-color: #ea580c !important;
                }
            `}</style>
        </div>
    );
}
