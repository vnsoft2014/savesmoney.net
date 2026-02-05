'use client';

import { Button } from '@/shared/shadecn/ui/button';
import { MenuLink } from '@/shared/types';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { memo, useCallback, useState } from 'react';

interface Props {
    item: MenuLink;
    level: number;
    onToggle: () => void;
}

function MenuItem({ item, level, onToggle }: Props) {
    const [open, setOpen] = useState(false);
    const hasChildren = !!item.links?.length;

    const toggleSub = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpen((v) => !v);
    }, []);

    return (
        <div className="w-full">
            <div
                className={`flex items-center justify-between rounded-sm transition-colors cursor-pointer duration-200 hover:bg-linear-to-r hover:from-blue-50 hover:to-indigo-50`}
            >
                <Link
                    href={item.href}
                    prefetch={false}
                    onClick={onToggle}
                    className="flex-1 px-4 py-2.5 text-sm font-medium transition-colors text-gray-800 hover:text-blue-600"
                >
                    {item.label}
                </Link>
                {hasChildren && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 mr-2 hover:bg-transparent"
                        onClick={toggleSub}
                    >
                        <ChevronRight
                            className={`h-4 w-4 transition-transform duration-200 ${
                                open ? 'rotate-90 text-primary' : ''
                            }`}
                        />
                    </Button>
                )}
            </div>

            {hasChildren && open && (
                <div className="mt-1 ml-4 pl-4 border-l border-gray-100 space-y-1">
                    {item.links!.map((subItem, idx) => (
                        <MenuItem key={`${subItem.href}-${idx}`} item={subItem} level={level + 1} onToggle={onToggle} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default memo(MenuItem);
