'use client';

import { Store } from '@/shared/types';
import Link from 'next/link';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ImageWithFallback } from '../../deal-detail/components';

// Import Swiper styles
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type Props = {
    stores: Store[];
};

const StoresSlider = ({ stores }: Props) => {
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);

    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    return (
        <section className="font-sans-condensed py-6">
            <div className="flex justify-between items-center">
                <h3 className="hidden md:block md:text-lg lg:text-xl font-bold">All Stores</h3>

                <div className="flex items-center gap-1 md:gap-3">
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

            <div className="mt-5 py-3 md:py-4">
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
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
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    breakpoints={{
                        480: { slidesPerView: 4, spaceBetween: 20 },
                        768: { slidesPerView: 6, spaceBetween: 24 },
                        1024: { slidesPerView: 8, spaceBetween: 24 },
                        1280: { slidesPerView: 10, spaceBetween: 30 },
                    }}
                    className="stores-swiper pb-4!"
                >
                    {stores.map((store) => (
                        <SwiperSlide key={store._id}>
                            <Link
                                href={`/store/${store.slug}-${store._id}`}
                                prefetch={false}
                                className="group flex flex-col items-center p-3 text-center transition-all"
                            >
                                <div className="relative w-full aspect-square rounded-full p-1 border-2 border-transparent group-hover:border-primary-500 transition-all duration-300">
                                    <div className="relative w-full h-full rounded-full overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-shadow">
                                        <ImageWithFallback
                                            src={store.thumbnail}
                                            alt={store.name}
                                            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </div>
                                </div>

                                <div className="mt-3 text-xs md:text-sm font-bold uppercase tracking-tight text-gray-600 group-hover:text-black transition-colors line-clamp-1 w-full">
                                    {store.name}
                                </div>
                            </Link>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default StoresSlider;
