'use client';

import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { memo, useMemo } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    basePath?: string;
}

function Pagination({ currentPage, totalPages, hasNextPage, hasPrevPage, basePath = '' }: PaginationProps) {
    const pageNumbers = useMemo(() => {
        if (totalPages <= 1) return [];

        const pages: (number | string)[] = [];
        const threshold = 7;

        if (totalPages <= threshold) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);

            if (currentPage > 3) pages.push('ellipsis-start');

            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) pages.push(i);

            if (currentPage < totalPages - 2) pages.push('ellipsis-end');

            pages.push(totalPages);
        }

        return pages;
    }, [currentPage, totalPages]);

    if (totalPages <= 1) return null;

    const buildHref = (page: number) => `${basePath}?page=${page}`;

    const linkBaseClass = 'min-w-9 h-9 px-2 flex items-center justify-center rounded border transition';

    return (
        <div className="flex justify-center items-center gap-2 mt-8">
            {hasPrevPage ? (
                <Link
                    href={buildHref(currentPage - 1)}
                    prefetch={false}
                    className={`${linkBaseClass} hover:bg-gray-200`}
                >
                    <ArrowLeft size={16} />
                </Link>
            ) : (
                <span className={`${linkBaseClass} opacity-40 cursor-not-allowed`}>
                    <ArrowLeft size={16} />
                </span>
            )}

            {pageNumbers.map((page, index) =>
                typeof page === 'string' ? (
                    <span
                        key={`${page}-${index}`}
                        className="min-w-9 h-9 px-2 flex items-center justify-center text-gray-500"
                    >
                        …
                    </span>
                ) : (
                    <Link
                        key={page}
                        prefetch={false}
                        href={buildHref(page)}
                        className={`${linkBaseClass} ${
                            currentPage === page
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {page}
                    </Link>
                ),
            )}

            {hasNextPage ? (
                <Link
                    href={buildHref(currentPage + 1)}
                    prefetch={false}
                    className={`${linkBaseClass} hover:bg-gray-200`}
                >
                    <ArrowRight size={16} />
                </Link>
            ) : (
                <span className={`${linkBaseClass} opacity-40 cursor-not-allowed`}>
                    <ArrowRight size={16} />
                </span>
            )}
        </div>
    );
}

export default memo(Pagination);
