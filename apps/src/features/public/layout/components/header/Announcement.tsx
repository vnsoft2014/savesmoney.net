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
            <div className="hidden md:block w-full bg-blue-950 px-3 py-2 text-gray-200 text-[11px] italic text-center">
                When you buy through links on Savesmoney.net, we may earn a commission.
            </div>
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
