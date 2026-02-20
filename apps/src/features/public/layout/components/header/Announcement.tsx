'use client';
/* eslint-disable @next/next/no-img-element */
import { useAuth } from '@/hooks/useAuth';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { AutoLogoutWarning } from '@/shared/components/widgets';
import { Button } from '@/shared/shadecn/ui/button';
import Link from 'next/link';
import { memo } from 'react';
import { Logo, SearchBox, TopNavClient, UserDropDown } from './components';
import MobileMenu from './components/MobileMenu';

const Announcement = () => {
    const { user, isSignin, isAdmin, login, logout } = useAuth();

    const { showPopup, stayLoggedIn, logoutNow } = useIdleLogout(logout, isAdmin);

    return (
        <>
            {isAdmin && showPopup && <AutoLogoutWarning onStayActive={stayLoggedIn} onLogout={logoutNow} />}
            <div className="relative w-full bg-blue-900 border-b border-blue-800">
                <div className="xl:container mx-auto px-3">
                    <div className="flex justify-between items-center gap-2 md:gap-4 py-3">
                        <div className="shrink-0">
                            <Link
                                href="/"
                                prefetch={false}
                                className="outline-none focus:outline-none focus-visible:outline-none"
                            >
                                <Logo />
                            </Link>
                            <div className="hidden lg:block overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-200 mt-1">
                                <span className="cursor-pointer text-gray-100 text-xs md:text-sm hover:text-white transition-colors">
                                    Ads-supported and referral-based community
                                </span>
                            </div>
                        </div>

                        <div className="flex-1 lg:max-w-2xl">
                            <SearchBox />
                        </div>

                        <div className="hidden xl:flex items-center gap-6">
                            <TopNavClient />

                            {isSignin && user ? (
                                <UserDropDown user={user} handleSignOut={logout} />
                            ) : (
                                <Button
                                    onClick={login}
                                    className="px-4 lg:px-5 py-2 text-sm font-semibold bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                                >
                                    Sign In
                                </Button>
                            )}
                        </div>

                        <MobileMenu />
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(Announcement);
