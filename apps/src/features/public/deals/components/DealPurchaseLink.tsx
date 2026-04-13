'use client';

import { fetcher } from '@/lib/utils';
import { MouseEvent, ReactNode } from 'react';

type DealPurchaseLinkProps = {
    dealId: string;
    href: string;
    children: ReactNode;
    className?: string;
};

const DealPurchaseLink = ({ dealId, href, children, className }: DealPurchaseLinkProps) => {
    const handleClick = (_e: MouseEvent<HTMLAnchorElement>) => {
        try {
            fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${dealId}/purchase-click`, {
                method: 'POST',
                keepalive: true,
            });
        } catch (_: unknown) {}
    };

    return (
        <a href={href} target="_blank" rel="nofollow sponsored" onClick={handleClick} className={className}>
            {children}
        </a>
    );
};

export default DealPurchaseLink;
