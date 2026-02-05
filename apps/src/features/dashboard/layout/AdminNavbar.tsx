'use client';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { AutoLogoutWarning } from '@/shared/components/widgets';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { useState } from 'react';
import { GiLoincloth } from 'react-icons/gi';
import { IoIosAddCircle } from 'react-icons/io';
import { IoHomeOutline } from 'react-icons/io5';

export default function AdminNavbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = () => {
        Cookies.remove('token');
        localStorage.clear();
        location.reload();
    };

    const { showPopup, stayLoggedIn, logoutNow } = useIdleLogout(() => {
        handleSignOut();
    }, true);

    return (
        <>
            {showPopup && <AutoLogoutWarning onStayActive={stayLoggedIn} onLogout={logoutNow} />}
            <div className="navbar bg-white dark:bg-gray-800 text-black dark:text-white shadow-sm">
                <div className="flex-1">
                    <div className="relative md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"
                                />
                            </svg>
                        </button>
                        {isMenuOpen && (
                            <ul className="menu menu-compact absolute left-0 mt-3 p-2 shadow bg-white dark:bg-gray-700 rounded-box w-52 z-50">
                                <li>
                                    <Link href={'/'} className="flex items-center">
                                        <IoHomeOutline size={20} className="mr-2" /> Back to Home
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/dashboard'} className="flex items-center">
                                        <GiLoincloth size={20} className="mr-2" /> Deals
                                    </Link>
                                </li>
                                <li>
                                    <Link href={'/dashboard/add-deal'} className="flex items-center">
                                        <IoIosAddCircle size={20} className="mr-2" /> Add Deals
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
                <div className="flex justify-end mr-5">
                    <div className="relative">
                        <button onClick={() => setIsOpen(!isOpen)} className="btn btn-ghost avatar">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 text-white dark:text-gray-300"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>
                        </button>
                        {isOpen && (
                            <ul className="menu menu-compact absolute right-0 mt-3 p-2 shadow-lg bg-white dark:bg-gray-700 rounded-box w-52 z-50">
                                <li onClick={handleSignOut}>
                                    <button className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
