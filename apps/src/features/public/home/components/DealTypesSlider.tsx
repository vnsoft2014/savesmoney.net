'use client';

import { DealType } from '@/types';
import Link from 'next/link';
import { Autoplay, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    dealTypes: DealType[];
};

const DealTypesSlider = ({ dealTypes }: Props) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    return (
        <section className="font-sans-condensed">
            <div className="flex justify-between items-center">
                <h3 className="md:text-lg lg:text-xl font-bold">All Categories</h3>

                <div className="flex items-center gap-1 md:gap-3">
                    <button
                        ref={(node) => setPrevEl(node)}
                        type="button"
                        aria-label="Previous slide"
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
                        type="button"
                        aria-label="Next slide"
                        disabled={isEnd}
                        className={`flex justify-center items-center w-7 h-7 md:w-9 md:h-9 rounded-full border transition
                            ${isEnd ? 'border-border text-muted-foreground cursor-not-allowed' : 'hover:bg-muted'}`}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mt-3 px-3 py-3 bg-white border border-gray-100 shadow-xs">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={15}
                    slidesPerView={3}
                    navigation={{
                        prevEl,
                        nextEl,
                    }}
                    updateOnWindowResize
                    onSlideChange={(swiper) => {
                        setIsBeginning(swiper.isBeginning);
                        setIsEnd(swiper.isEnd);
                    }}
                    autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                    breakpoints={{
                        480: { slidesPerView: 4 },
                        768: { slidesPerView: 6 },
                        1024: { slidesPerView: 8 },
                        1280: { slidesPerView: 10 },
                    }}
                    className="dealTypes-swiper"
                >
                    {dealTypes.map((dealType) => (
                        <SwiperSlide key={dealType._id}>
                            <Link
                                href={`/deals/${dealType.slug}-${dealType._id}`}
                                prefetch={false}
                                className="group flex flex-col items-center text-center transition-all"
                            >
                                <div className="relative w-full p-1 border-2 border-transparent group-hover:scale-105 transition-all duration-300">
                                    <Image
                                        src={dealType.thumbnail || '/image.png'}
                                        alt=""
                                        aria-hidden="true"
                                        width={96}
                                        height={96}
                                        className="w-full aspect-square object-cover rounded-full border bg-muted"
                                    />
                                </div>

                                <div className="mt-3 text-xs md:text-sm font-bold uppercase group-hover:text-primary transition">
                                    {dealType.name}
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default DealTypesSlider;
