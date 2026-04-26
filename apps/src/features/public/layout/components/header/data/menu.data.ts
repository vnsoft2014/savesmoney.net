import { HeaderProps } from '../types';

export const headerData: HeaderProps = [
    {
        label: 'Deals',
        href: '/deals',
        icon: 'chevron-down',
        links: [],
    },
    {
        label: 'Electronics',
        href: '/electronics',
    },
    {
        label: 'Household Items',
        href: '/household-items',
    },
    {
        label: 'Clothes and Fashion',
        href: '/clothes-and-fashion',
    },
    // {
    //     label: 'Expiring Soon',
    //     href: '/expiring-soon',
    // },
    // {
    //     label: 'Trending Deals',
    //     href: '/trending-deals',
    // },
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
                label: 'All SM Stores',
                href: '/sm-stores',
            },
            {
                label: 'My Store',
                href: '/my-store',
            },
        ],
    },
];

export const supportData: HeaderProps = [
    {
        label: 'Deal alert',
        href: '/deal-alert',
    },
    {
        label: 'Contact',
        href: '/contact',
    },
];
