'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/shared/shadecn/ui/avatar';
import { Button } from '@/shared/shadecn/ui/button';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/shared/shadecn/ui/navigation-menu';
import { User } from '@/types';
import { getInitials } from '@/utils/utils';
import { LayoutDashboard, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
    user: User;
    handleSignOut: () => void;
}

const UserDropdown = ({ user, handleSignOut }: Props) => {
    return (
        <div className="hidden xl:block">
            <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger className="text-white">
                            <div className="flex items-center space-x-2">
                                <Avatar className="w-6 h-6 border">
                                    <AvatarImage src={user?.avatar} alt={user?.name} />
                                    <AvatarFallback className="bg-blue-500 text-[10px] text-white">
                                        {getInitials(user?.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm font-semibold selection:bg-transparent">
                                    {user?.name || 'User'}
                                </span>
                            </div>
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                            <div className="w-56 p-4 bg-white rounded-md shadow-md">
                                <div className="flex flex-col space-y-1 mb-3">
                                    <div className="text-sm font-medium leading-none text-black">
                                        {user?.name || 'User'}
                                    </div>
                                    <div className="text-xs leading-none text-muted-foreground">
                                        {user?.email || 'user@example.com'}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-300 my-2" />

                                <ul className="grid gap-1">
                                    {(user.role === 'admin' || user.role === 'contributor') && (
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/dashboard"
                                                    prefetch={false}
                                                    className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                                                >
                                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                                    <span>Dashboard</span>
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    )}

                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href={`/user/profile/${user._id}`}
                                                prefetch={false}
                                                className="flex items-center px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                                            >
                                                <UserIcon className="mr-2 h-4 w-4" />
                                                <span>Profile</span>
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>

                                <div className="h-px bg-slate-300 my-2" />

                                <Button
                                    onClick={handleSignOut}
                                    variant="ghost"
                                    className="flex w-full justify-start px-2 py-1.5 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Sign Out</span>
                                </Button>
                            </div>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    );
};

export default UserDropdown;
