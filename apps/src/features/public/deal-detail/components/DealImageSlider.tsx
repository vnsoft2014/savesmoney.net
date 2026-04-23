'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { useState } from 'react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/thumbs';

type Props = {
    images: string[];
    alt: string;
    fallback?: string;
};

export default function DealImageSlider({ images, alt, fallback = '/image.png' }: Props) {
    const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

    const validImages = images?.length > 0 ? images : [fallback];

    // If only one image, render a simple image without slider
    if (validImages.length === 1) {
        return (
            <div className="relative flex h-full items-center">
                <Image
                    src={validImages[0]}
                    alt={alt}
                    width={400}
                    height={400}
                    className="w-full max-h-full object-cover"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = fallback;
                    }}
                />
            </div>
        );
    }

    return (
        <div className="deal-image-slider">
            {/* Main slider */}
            <Swiper
                modules={[Navigation, Pagination, Thumbs]}
                spaceBetween={2}
                slidesPerView={1}
                navigation={false}
                pagination={false}
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

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <Swiper
                    onSwiper={setThumbsSwiper}
                    modules={[Thumbs]}
                    spaceBetween={6}
                    slidesPerView={4}
                    watchSlidesProgress
                    className="deal-thumbs-swiper mt-2"
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
                                    width={150}
                                    height={150}
                                    className="w-full aspect-square object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = fallback;
                                    }}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}

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

                .deal-main-swiper .swiper-pagination-bullet {
                    width: 7px;
                    height: 7px;
                }

                .deal-thumbs-swiper .swiper-slide-thumb-active > div {
                    border-color: #ea580c !important;
                }
            `}</style>
        </div>
    );
}
