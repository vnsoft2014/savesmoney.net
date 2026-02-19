'use client';

import {
    Atom,
    BarChart3,
    Bell,
    BrickWall,
    Home,
    LogOut,
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
                    {item.children.map((child) => {
                        const childContent = (
                            <>
                                {child.icon}
                                {child.label}
                            </>
                        );

                        return (
                            <li key={child.key} className="py-2">
                                {child.href ? (
                                    <Link href={child.href} className="flex items-center w-full text-sm">
                                        {childContent}
                                    </Link>
                                ) : child.activeKey ? (
                                    <button
                                        onClick={() => onClick(child.activeKey!)}
                                        className="flex items-center w-full text-sm"
                                    >
                                        {childContent}
                                    </button>
                                ) : (
                                    <div className="flex items-center w-full text-sm">{childContent}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
});

export default function AdminSidebar() {
    const dispatch = useDispatch();
    const { user, logout } = useAuth();

    const handleSetActive = useCallback(
        (key: string) => {
            dispatch(setNavActive(key));
        },
        [dispatch],
    );

    const handleSignOut = () => {
        logout();
    };

    return (
        <aside className="md:w-64 bg-white border-r border-gray-200 min-h-screen">
            <div className="flex items-center h-20 px-4 border-b">
                <Link href="/" className="flex items-center gap-2">
                    <Home size={24} className="text-blue-500" />
                    <span className="font-semibold text-lg">Dashboard</span>
                </Link>
            </div>

            <ul className="flex-1 px-4 py-4 flex flex-col overflow-y-auto">
                {NAV_ITEMS.filter((item) => !item.role || item.role === user?.role).map((item) => (
                    <MenuItem key={item.key} item={item} onClick={handleSetActive} />
                ))}
            </ul>

            <div className="px-4 pb-6 pt-4 border-t">
                <button
                    onClick={handleSignOut}
                    className="flex items-center w-full py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                    <LogOut size={18} className="mr-2" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
