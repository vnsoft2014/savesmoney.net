import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { ReactNode } from 'react';

export type BreadcrumbItem = {
    label: ReactNode;
    href?: string;
    icon?: ReactNode;
    active?: boolean;
};

type BreadcrumbProps = {
    items: BreadcrumbItem[];
};

const Breadcrumb = ({ items }: BreadcrumbProps) => {
    return (
        <ul className="flex flex-1 items-center gap-1 py-2 text-sm md:text-base font-sans-condensed">
            {items.map((item, index) => {
                const isLast = index === items.length - 1;
                const isActive = item.active || isLast;

                return (
                    <li key={index} className="flex items-center">
                        {item.href && !isActive ? (
                            <Link
                                href={item.href}
                                className="flex items-center gap-1 hover:text-orange-600 font-bold transition-colors"
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ) : (
                            <span className="flex items-center gap-1 text-orange-600">
                                {item.icon}
                                {item.label}
                            </span>
                        )}

                        {!isLast && <ChevronRight className="w-4 h-4 ml-1 text-gray-400" />}
                    </li>
                );
            })}
        </ul>
    );
};

export default Breadcrumb;
