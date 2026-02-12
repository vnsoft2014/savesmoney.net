'use client';

import { SettingsForm } from '@/types/settings';
import { setLinks, setSettings } from '@/utils/FrontendNavSlice';
import { setUserData } from '@/utils/UserDataSlice';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { MenuLink } from '../types';

interface MainNavClientProps {
    links: Array<MenuLink>;
    settings: SettingsForm;
}

const ICON_MAP: Record<string, any> = {
    'chevron-down': ChevronDown,
};

const MainNavClient = ({ links, settings }: MainNavClientProps) => {
    const ref = useRef<HTMLUListElement | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLinks(links));
        dispatch(setSettings(settings));

        const userData = localStorage.getItem('user');
        if (!userData) return;

        dispatch(setUserData(JSON.parse(userData)));
    }, [dispatch, links]);

    return (
        <div className={`hidden xl:block sticky top-0 z-9 mx-auto w-full bg-white shadow-sm transition-all`}>
            <nav className="container px-3">
                <ul ref={ref} className="flex flex-row justify-between text-sm">
                    {links.map(({ label, href, icon, links: sub }, index) => {
                        const subLinks = sub;

                        const IconComponent = icon ? ICON_MAP[icon] : null;

                        {
                            IconComponent && <IconComponent className="ml-1 h-3.5 w-3.5 hidden md:block" />;
                        }

                        return (
                            <li key={index} className="relative group">
                                <Link
                                    href={href}
                                    prefetch={false}
                                    className="flex items-center p-4 text-[17px] font-sans-condensed font-bold hover:text-gray-700 transition-colors"
                                >
                                    {label}
                                    {IconComponent && <IconComponent className="ml-1 h-3.5 w-3.5 hidden md:block" />}
                                </Link>

                                {Array.isArray(subLinks) && (
                                    <ul className="max-w-fit w-full min-w-48 md:absolute md:hidden md:group-hover:block -bottom-px translate-y-full bg-white shadow">
                                        {subLinks.map((item, i: number) => (
                                            <li key={i}>
                                                <Link
                                                    href={item.href}
                                                    prefetch={false}
                                                    className="block px-5 py-2 text-base font-sans-condensed font-bold hover:text-gray-700"
                                                >
                                                    {item.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
};

export default MainNavClient;
