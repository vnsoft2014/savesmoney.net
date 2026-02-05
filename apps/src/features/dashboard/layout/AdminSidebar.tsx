'use client';

import {
    BarChart3,
    Bell,
    Home,
    LayoutDashboard,
    MessageCircle,
    Package,
    PlusCircle,
    Settings,
    Store,
    Tags,
} from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { useAuth } from '@/hooks/useAuth';
import { setNavActive } from '@/utils/AdminNavSlice';

type NavItem = {
    key: string;
    label: string;
    icon: React.ReactNode;
    activeKey?: string;
    href?: string;
    role?: 'admin';
};

const NAV_ITEMS: NavItem[] = [
    {
        key: 'overview',
        label: 'Overview',
        icon: <BarChart3 size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeOverview',
    },
    {
        key: 'deals',
        label: 'Deals',
        icon: <Package size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeDeals',
    },
    {
        key: 'add-deal',
        label: 'Add Deals',
        icon: <PlusCircle size={20} className="mx-2 text-blue-500" />,
        href: '/dashboard/deal/add',
    },
    {
        key: 'deal-verification',
        label: 'Deal Validations',
        icon: <Package size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeDealVerification',
    },
    {
        key: 'deal-types',
        label: 'Deal Types',
        icon: <Tags size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeDealTypes',
    },
    {
        key: 'stores',
        label: 'Stores',
        icon: <Store size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeStores',
    },
    {
        key: 'comments',
        label: 'Comments',
        icon: <MessageCircle size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeComments',
    },

    // admin only
    {
        key: 'subscribers',
        label: 'Subscribers',
        icon: <Bell size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeSubscribers',
        role: 'admin',
    },
    {
        key: 'users',
        label: 'Users',
        icon: <Package size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeUsers',
        role: 'admin',
    },
    {
        key: 'settings',
        label: 'Settings',
        icon: <Settings size={20} className="mx-2 text-blue-500" />,
        activeKey: 'activeSettings',
        role: 'admin',
    },
];

const MenuItem = memo(function MenuItem({ item, onClick }: { item: NavItem; onClick: (key: string) => void }) {
    const content = (
        <>
            {item.icon}
            {item.label}
        </>
    );

    return (
        <li className="py-3 px-1 mb-3">
            {item.href ? (
                <Link href={item.href} className="flex items-center justify-center">
                    {content}
                </Link>
            ) : (
                <button
                    onClick={() => item.activeKey && onClick(item.activeKey)}
                    className="flex items-center justify-center"
                >
                    {content}
                </button>
            )}
        </li>
    );
});

export default function AdminSidebar() {
    const dispatch = useDispatch();
    const { user } = useAuth();

    const handleSetActive = useCallback(
        (key: string) => {
            dispatch(setNavActive(key));
        },
        [dispatch],
    );

    return (
        <aside className="w-60 hidden md:block bg-white h-full dark:text-black">
            <div className="w-full flex items-center py-2 px-2 h-20 gap-3">
                <Link href="/" className="flex items-center justify-center">
                    <Home size={30} className="mx-2 text-blue-500" />
                </Link>

                <h1 className="flex items-center text-xl font-semibold">
                    <LayoutDashboard className="mx-2" />
                    Dashboard
                </h1>
            </div>

            <ul className="flex px-4 flex-col">
                {NAV_ITEMS.filter((item) => !item.role || item.role === user?.role).map((item) => (
                    <MenuItem key={item.key} item={item} onClick={handleSetActive} />
                ))}
            </ul>
        </aside>
    );
}
