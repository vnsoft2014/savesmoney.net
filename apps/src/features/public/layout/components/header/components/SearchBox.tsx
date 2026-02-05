'use client';

import DealPrice from '@/features/public/deals/components/DealPrice';
import { searchDeals } from '@/services';
import { DealRaw } from '@/shared/types';
import { getDaysRemaining, getDealLabel, getDealLabelClasses } from '@/utils/deal';
import { ArrowRight, Search, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const SearchBox = () => {
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [hasNextPage, setHasNextPage] = useState(false);

    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const searchBoxRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (abortControllerRef.current) abortControllerRef.current.abort();

            if (query.trim() === '') {
                setResults([]);
                setLoading(false);
                setIsOpen(false);
                return;
            }

            const controller = new AbortController();
            abortControllerRef.current = controller;

            setLoading(true);
            setIsOpen(true);

            try {
                const data = await searchDeals(query, 1, 5, '', '', controller.signal);

                if (data.success) {
                    setResults(data.data);
                    setHasNextPage(data.pagination.hasNextPage);
                }
            } catch (err: any) {
                if (err.name === 'AbortError') return;
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(handler);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearchSubmit = () => {
        if (!query.trim()) return;

        setIsOpen(false);
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    };

    const handleClearSearch = () => {
        setQuery('');
        setResults([]);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={searchBoxRef}>
            <div className="relative">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearchSubmit();
                    }}
                    className="relative flex items-center"
                >
                    <input
                        type="text"
                        placeholder="Search deals, stores and more..."
                        className="w-full pl-4 pr-20 py-2.5 text-sm border border-gray-300 bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query && setIsOpen(true)}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-11 top-1/2 -translate-y-1/2
                                    w-7 h-7 rounded-full
                                    hover:bg-gray-100
                                    flex items-center justify-center
                                    text-gray-400 hover:text-gray-600
                                    transition"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}

                    <button
                        type="submit"
                        className="absolute right-1 top-1/2 -translate-y-1/2
                                w-9 h-9 rounded-full
                                hover:bg-gray-100
                                flex items-center justify-center
                                text-gray-400 hover:text-gray-600
                                transition-colors"
                        aria-label="Search"
                    >
                        <Search className="w-6 h-6" />
                    </button>
                </form>
            </div>

            {isOpen && query && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {loading && (
                        <div className="flex justify-center items-center p-4 text-sm text-gray-500 text-center">
                            <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-orange-500"></div>
                            <span className="ml-2">Searching...</span>
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="p-6 text-center">
                            <p className="text-sm text-gray-500">No results found</p>
                            <p className="text-xs text-gray-400 mt-1">Try searching with a different keyword</p>
                        </div>
                    )}

                    {!loading && results.length > 0 && (
                        <>
                            <div id="search-result" className="max-h-100 overflow-y-auto">
                                {results.map((deal: DealRaw, idx) => {
                                    const daysRemaining = getDaysRemaining(deal.expireAt);
                                    const label = getDealLabel(deal.coupon, deal.clearance, daysRemaining);
                                    const labelClasses = getDealLabelClasses(
                                        deal.coupon,
                                        deal.clearance,
                                        daysRemaining,
                                    );

                                    return (
                                        <Link
                                            key={idx}
                                            href={`/deals/deal-detail/${deal.slug}-${deal._id}`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="flex items-center gap-3 px-2 py-1 md:p-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                                                <div className="relative w-10 h-10 md:w-16 md:h-16 shrink-0">
                                                    <img
                                                        src={deal.image}
                                                        alt={deal.shortDescription}
                                                        className="object-cover rounded-md"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-2 mb-1">
                                                        <div className="text-xs md:text-[15px] font-medium text-gray-900 line-clamp-2 flex-1">
                                                            {deal.shortDescription}
                                                        </div>
                                                        {label && (
                                                            <span
                                                                className={`hidden md:inline-flex items-center mt-1/2 px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap shrink-0 ${labelClasses}`}
                                                            >
                                                                {label}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <DealPrice
                                                        originalPrice={deal.originalPrice}
                                                        discountPrice={deal.discountPrice}
                                                        percentageOff={deal.percentageOff}
                                                        size="xs"
                                                    />
                                                </div>

                                                <ArrowRight className="hidden md:block w-5 h-5 text-orange-500 shrink-0" />
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>

                            {hasNextPage && (
                                <div className="border-t border-gray-200 bg-gray-50">
                                    <Link
                                        href={`/search?q=${encodeURIComponent(query)}`}
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full p-3 text-center text-xs md:text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-gray-100 transition-colors"
                                    >
                                        View all results →
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBox;
