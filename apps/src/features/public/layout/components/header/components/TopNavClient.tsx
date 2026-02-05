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
                <NavigationMenuList>
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
                        <NavigationMenuTrigger className="font-normal text-white hover:text-gray-200 transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent">
                            <span className="text-sm">Subscribe</span>
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                            <div className="w-70">
                                <SubscribeBox />
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>

                    <NavigationMenuLink asChild>
                        <Link
                            href={'/contact'}
                            prefetch={false}
                            className="text-sm text-white hover:text-gray-200 transition-colors whitespace-nowrap"
                        >
                            Contact
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
}
