'use client';

import { LogOut, Menu, User } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { AutoLogoutWarning } from '@/shared/components/widgets';

import { Button } from '@/shared/shadecn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/shared/shadecn/ui/dropdown-menu';

type AdminNavbarProps = {
    onToggleSidebar?: () => void;
};

export default function AdminNavbar({ onToggleSidebar }: AdminNavbarProps) {
    const { logout, user } = useAuth();

    const handleSignOut = () => {
        logout();
    };

    const { showPopup, stayLoggedIn, logoutNow } = useIdleLogout(() => {
        handleSignOut();
    }, true);

    return (
        <>
            {showPopup && <AutoLogoutWarning onStayActive={stayLoggedIn} onLogout={logoutNow} />}

            <header className="sticky top-0 z-40 w-full border-b bg-white dark:bg-gray-900">
                <div className="flex h-16 items-center justify-between px-4">
                    {/* Left side */}
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
                            <Menu className="h-5 w-5" />
                        </Button>

                        <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {/* Avatar Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="block relative h-9 w-9 p-0 rounded-full">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-white">
                                        <User className="h-4 w-4" />
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align="end" className="w-48">
                                <div className="px-2 py-1.5 text-sm font-medium">{user?.email || 'Admin'}</div>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
        </>
    );
}
