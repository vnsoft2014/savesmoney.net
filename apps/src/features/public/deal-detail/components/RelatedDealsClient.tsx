'use client';

import { DealFull } from '@/shared/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { DealCard } from '../../deals/components';

interface Props {
    dealId: string;
    storeName: string;
    storeSlug: string;
    storeId: string;
    deals: DealFull[];
}

export default function RelatedDealsClient({ storeName, storeSlug, storeId, deals }: Props) {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    return (
        <div className="pt-3 pb-0 md:py-4">
            <div className="flex justify-between items-center">
                <h3 className="mb-0! text-base md:text-lg font-bold">More Deals From {storeName}</h3>

                <div className="flex items-center gap-1 md:gap-3">
                    <Link href={`/store/${storeSlug}-${storeId}`} className="mr-2 text-xs md:text-base">
                        See all
                    </Link>

                    <button
                        ref={(node) => setPrevEl(node)}
                        disabled={isBeginning}
                        className={`flex justify-center items-center w-7 h-7 md:w-9 md:h-9 rounded-full border transition
                            ${
                                isBeginning
                                    ? 'border-border text-muted-foreground cursor-not-allowed'
                                    : 'hover:bg-muted'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <button
                        ref={(node) => setNextEl(node)}
                        disabled={isEnd}
                        className={`flex justify-center items-center w-7 h-7 md:w-9 md:h-9 rounded-full border transition
                            ${isEnd ? 'border-border text-muted-foreground cursor-not-allowed' : 'hover:bg-muted'}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mt-3">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={14}
                    slidesPerView={1}
                    navigation={{
                        prevEl,
                        nextEl,
                    }}
                    updateOnWindowResize
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    breakpoints={{
                        768: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                >
                    {deals.map((deal) => (
                        <SwiperSlide key={deal._id}>
                            <DealCard deal={deal} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
}
