import { HeaderProps } from '../types';

export const headerData: HeaderProps = [
    {
        label: 'Deals',
        href: '/deals',
        icon: 'chevron-down',
        links: [],
    },
    {
        label: 'Expiring Soon',
        href: '/expiring-soon',
    },
    {
        label: 'Trending Deals',
        href: '/trending-deals',
    },
    {
        label: 'Holiday Deals',
        href: '/holiday-deals',
    },
    {
        label: 'Seasonal Deals',
        href: '/seasonal-deals',
    },
    {
        label: 'SM Stores',
        href: '/sm-stores',
        links: [
            {
                label: 'All Stores',
                href: '/sm-stores',
            },
            {
                label: 'My Store',
                href: '/my-store',
            },
        ],
    },
];
