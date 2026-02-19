'use client';

import AdminNavbar from '@/features/dashboard/layout/AdminNavbar';
import AdminSidebar from '@/features/dashboard/layout/AdminSidebar';
import SuperComponent from '@/features/dashboard/layout/SuperComponent';
import { useState } from 'react';

const Page = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
            <div className="hidden lg:flex">
                <AdminSidebar />
            </div>
            <div
                className={`fixed inset-0 z-50 lg:hidden ${mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
            >
                <div
                    onClick={() => setMobileOpen(false)}
                    className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
                        mobileOpen ? 'opacity-100' : 'opacity-0'
                    }`}
                />

                <div
                    className={`absolute left-0 top-0 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                        mobileOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <AdminSidebar />
                </div>
            </div>

            <div className="relative w-full">
                <AdminNavbar onToggleSidebar={() => setMobileOpen(true)} />
                <div className="absolute top-0 left-0 right-0 bottom-0 overflow-y-auto px-4 pt-24 pb-12">
                    <SuperComponent />
                </div>
            </div>
        </div>
    );
};

export default Page;
