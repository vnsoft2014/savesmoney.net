'use client';

import { LayoutDashboard, LogOut, User, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '@/store/store';

import { useAuth } from '@/hooks/useAuth';
import { SubscribeBox } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { ScrollArea } from '@/shared/shadecn/ui/scroll-area';
import { Separator } from '@/shared/shadecn/ui/separator';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/shadecn/ui/sheet';
import { supportData } from '../data';
import { MenuLink } from '../types';
import MenuItem from './MenuItem';
import UserProfile from './UserProfile';

const MobileMenu = () => {
    const dispatch = useDispatch();

    const { user, isSignin, login, logout } = useAuth();

    const [open, setOpen] = useState(false);

    const links = useSelector((state: RootState) => state.frontendNav.links) as MenuLink[];

    const closeMenu = useCallback(() => setOpen(false), []);

    const handleSignIn = useCallback(() => {
        setOpen(false);
        login();
    }, []);

    const handleSignOut = useCallback(() => {
        setOpen(false);
        logout();
    }, [dispatch]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="xl:hidden text-white hover:bg-white/10">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </Button>
            </SheetTrigger>

            <SheetContent side="left" className="p-0 flex flex-col gap-0 w-75 sm:w-87.5">
                <SheetHeader className="sr-only">
                    <SheetTitle>Mobile Navigation</SheetTitle>
                </SheetHeader>

                {isSignin && user ? (
                    <>
                        <UserProfile user={user} />
                        <div className="p-2 bg-muted/30">
                            {(user.role === 'admin' || user.role === 'contributor') && (
                                <Button
                                    variant="ghost"
                                    className="w-full items-center justify-start rounded-sm transition-colors cursor-pointer duration-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50"
                                    asChild
                                >
                                    <Link
                                        href="/dashboard"
                                        prefetch={false}
                                        className="text-sm md:text-[15px] text-gray-800 hover:text-blue-600"
                                        onClick={() => setOpen(false)}
                                    >
                                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                                    </Link>
                                </Button>
                            )}
                            <Button
                                variant="ghost"
                                className="w-full items-center justify-start rounded-sm transition-colors cursor-pointer duration-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50"
                                asChild
                            >
                                <Link
                                    href={`/user/profile/${user._id}`}
                                    prefetch={false}
                                    className="text-sm md:text-[15px] text-gray-800 hover:text-blue-600"
                                    onClick={() => setOpen(false)}
                                >
                                    <UserCircle className="mr-2 h-4 w-4" /> Profile
                                </Link>
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="p-6 text-center space-y-4 bg-linear-to-br from-gray-100 to-gray-200">
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm md:text-[15px] text-muted-foreground">Sign in to access more features</p>
                        <Button
                            className="w-full text-sm md:text-[15px] bg-blue-600 hover:bg-blue-700"
                            onClick={handleSignIn}
                        >
                            Sign In
                        </Button>
                    </div>
                )}

                <Separator />

                <ScrollArea className="flex-1 px-2 py-4">
                    <div className="space-y-1">
                        <p className="px-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Menu
                        </p>
                        {links.map((item, idx) => (
                            <MenuItem key={idx} item={item} level={0} onToggle={closeMenu} />
                        ))}

                        <Separator className="my-4" />

                        <div className="w-full">
                            <div className="flex items-center justify-between rounded-sm transition-colors cursor-pointer duration-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50">
                                <Link
                                    href="/my-store/deal/add"
                                    prefetch={false}
                                    onClick={closeMenu}
                                    className="flex-1 px-4 py-2 text-sm md:text-[15px] font-medium transition-colors text-gray-800 hover:text-blue-600"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700/20">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-4 h-4"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={2.5}
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                        </div>
                                        Post a Deal
                                    </div>
                                </Link>
                            </div>
                        </div>

                        <Separator className="my-4" />

                        <p className="px-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Support
                        </p>
                        {supportData.map((item, idx) => (
                            <MenuItem key={idx} item={item} level={0} onToggle={closeMenu} />
                        ))}

                        <Separator className="my-4" />
                        <p className="px-4 text-[10px] md:text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                            Subscribe
                        </p>
                        <SubscribeBox />
                    </div>
                </ScrollArea>

                {isSignin && (
                    <div className="p-4 border-t">
                        <Button
                            variant="destructive"
                            className="w-full px-4 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-md hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm md:text-[15px] font-medium shadow-lg hover:shadow-xl active:scale-98 items-center justify-center space-x-2"
                            onClick={handleSignOut}
                        >
                            <LogOut className="mr-2 h-4 w-4" /> Sign Out
                        </Button>
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default memo(MobileMenu);
