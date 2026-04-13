'use client';

import { LayoutDashboard, Menu, Settings, Tag } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Loading } from '@/components/common';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/shared/shadecn/ui/button';
import { ScrollArea } from '@/shared/shadecn/ui/scroll-area';
import { Separator } from '@/shared/shadecn/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/shared/shadecn/ui/sheet';
import MyStoreGuestBanner from '../MyStoreGuestBanner';
import { checkUserStore } from '../services';
import { CreateStoreForm } from './components';

type MyStoreShellProps = {
    children: React.ReactNode;
    title?: string;
};

export default function MyStoreShell({ children, title = 'My Store' }: MyStoreShellProps) {
    const pathname = usePathname();
    const { isSignin, isLoading } = useAuth();

    const [storeRes, setStoreRes] = useState<any>(null);
    const [loadingStore, setLoadingStore] = useState(false);

    useEffect(() => {
        if (!isSignin) return;

        const fetchStore = async () => {
            setLoadingStore(true);
            const data = await checkUserStore();
            setStoreRes(data);
            setLoadingStore(false);
        };

        fetchStore();
    }, [isSignin]);

    if (isLoading) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!isSignin) {
        return <MyStoreGuestBanner />;
    }

    if (loadingStore) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    if (!storeRes?.exists) {
        return (
            <div className="min-h-full py-6">
                <CreateStoreForm />
            </div>
        );
    }

    const menus = [
        {
            name: 'Overview',
            href: '/my-store',
            icon: LayoutDashboard,
        },
        {
            name: 'All Deals',
            href: '/my-store/deals',
            icon: Tag,
        },
        {
            name: 'Settings',
            href: '/my-store/settings',
            icon: Settings,
        },
    ];

    const SidebarContent = () => (
        <div className="flex h-full flex-col">
            <div className="px-6 py-5">
                <h2 className="text-lg font-semibold tracking-tight">My Store</h2>
            </div>

            <Separator />

            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {menus.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-muted text-foreground'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                )}
                                prefetch={false}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>
        </div>
    );

    return (
        <div className="flex min-h-[80vh] bg-muted/40">
            <aside className="hidden w-64 border-r bg-background lg:block">
                <SidebarContent />
            </aside>

            <div className="flex flex-1 flex-col">
                <div className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="left" className="w-64 p-0">
                            <SidebarContent />
                        </SheetContent>
                    </Sheet>

                    <h1 className="text-sm font-semibold">{title}</h1>
                </div>

                <div className="container mx-auto px-3">{children}</div>
            </div>
        </div>
    );
}
