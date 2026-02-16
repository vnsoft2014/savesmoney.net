'use client';

import SubscribeBox from '@/shared/components/common/SubscribeBox';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/shared/shadecn/ui/navigation-menu';
import Link from 'next/link';

export default function TopNav() {
    return (
        <div className="hidden xl:block">
            <NavigationMenu>
                <NavigationMenuList className="gap-4">
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                href="/my-store/deal/add"
                                className="group flex items-center gap-3 rounded-xl text-sm text-white hover:text-gray-200 transition-colors whitespace-nowrap"
                            >
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 group-hover:bg-white/30 transition">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-4 h-4 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2.5}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                Post a Deal
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                href={'/deal-alert'}
                                prefetch={false}
                                className="text-sm text-white hover:text-gray-200 transition-colors whitespace-nowrap"
                            >
                                Deal Alert
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="p-0 font-normal text-white hover:text-gray-200 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                            <span className="text-sm">Subscribe</span>
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                            <div className="w-70">
                                <SubscribeBox />
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuItem>
                        <NavigationMenuLink asChild>
                            <Link
                                href={'/contact'}
                                prefetch={false}
                                className="text-sm text-white hover:text-gray-200 transition-colors whitespace-nowrap"
                            >
                                Contact
                            </Link>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
