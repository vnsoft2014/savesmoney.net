'use client';

import {
    Atom,
    BarChart3,
    Bell,
    BrickWall,
    Home,
    LayoutDashboard,
    MessageCircle,
    Package,
    PlusCircle,
    Settings,
    Store,
    Tags,
    User,
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
    children?: NavItem[];
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
        children: [
            {
                key: 'add-deal',
                label: 'Add Deal',
                icon: <PlusCircle size={20} className="mx-2 text-blue-500" />,
                href: '/dashboard/deal/add',
            },
        ],
    },
    {
        key: 'user-store',
        label: 'User Store',
        icon: <Store size={20} className="mx-2 text-blue-500" />,
        children: [
            {
                key: 'user-stores',
                label: 'All Stores',
                icon: <BrickWall size={18} className="mx-2 text-blue-500" />,
                activeKey: 'activeUserStores',
            },
            {
                key: 'user-deals',
                label: 'Deals',
                icon: <Package size={18} className="mx-2 text-blue-500" />,
                activeKey: 'activeUserDeals',
            },
        ],
    },
    {
        key: 'deal-verification',
        label: 'Deal Validations',
        icon: <Atom size={20} className="mx-2 text-blue-500" />,
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
        icon: <User size={20} className="mx-2 text-blue-500" />,
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
        <li className="mb-2">
            {item.href ? (
                <Link href={item.href} className="flex items-center py-3 px-2">
                    {content}
                </Link>
            ) : item.activeKey ? (
                <button
                    onClick={() => onClick(item.activeKey!)}
                    className="flex items-center py-3 px-2 w-full text-left"
                >
                    {content}
                </button>
            ) : (
                <div className="flex items-center py-3 px-2 font-semibold">{content}</div>
            )}

            {item.children && (
                <ul className="ml-6 border-l border-gray-200 pl-3">
                    {item.children.map((child) => (
                        <li key={child.key} className="py-2">
                            <button
                                onClick={() => child.activeKey && onClick(child.activeKey)}
                                className="flex items-center w-full text-sm"
                            >
                                {child.icon}
                                {child.label}
                            </button>
                        </li>
                    ))}
                </ul>
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
        <aside className="w-70 h-full hidden md:block bg-white dark:text-black overflow-y-auto">
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
