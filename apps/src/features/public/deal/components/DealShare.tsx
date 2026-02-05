'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/shadecn/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/shared/shadecn/ui/dropdown-menu';
import { Link, Share2 } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { memo, useCallback, useMemo } from 'react';
import { FaFacebook, FaPinterest, FaWhatsapp } from 'react-icons/fa';
import { toast } from 'react-toastify';

type ShareOption = {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    link?: string;
    action?: () => void;
};

const ShareItem = memo(
    ({ Icon, color, label }: { Icon: React.ComponentType<{ className?: string }>; color: string; label: string }) => (
        <div className="flex flex-col items-center gap-1.5">
            <div
                className={cn(
                    'flex justify-center items-center w-10 h-10 rounded-full transition-transform group-hover:scale-110 shadow-sm',
                    color,
                )}
            >
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        </div>
    ),
);

const DealShare = () => {
    const pathname = usePathname();

    const shareUrl = useMemo(() => {
        if (typeof window === 'undefined') return '';
        return `${window.location.origin}${pathname}`;
    }, [pathname]);

    const handleCopyLink = useCallback(async () => {
        if (!shareUrl) return;

        try {
            await navigator.clipboard.writeText(shareUrl);
            toast.success('Link copied');
        } catch {
            toast.error('Failed to copy link');
        }
    }, [shareUrl]);

    const shareOptions: ShareOption[] = useMemo(
        () => [
            {
                name: 'Copy link',
                icon: Link,
                action: handleCopyLink,
                color: 'bg-muted hover:bg-muted/80 text-foreground',
            },
            {
                name: 'Facebook',
                icon: FaFacebook,
                link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                color: 'bg-[#1877F2] hover:bg-[#1877F2]/90 text-white',
            },
            {
                name: 'X',
                icon: () => (
                    <svg
                        display="block"
                        fill="none"
                        height="48"
                        viewBox="0 0 56 56"
                        width="48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect fill="#111111" height="56" rx="28" width="56"></rect>
                        <path
                            d="M30.3055 25.8561L40.505 14H38.088L29.2318 24.2945L22.1584 14H14L24.6964 29.5671L14 42H16.4171L25.7695 31.1287L33.2396 42H41.3979L30.3049 25.8561H30.3055ZM26.995 29.7042L25.9112 28.1541L17.288 15.8196H21.0005L27.9595 25.7739L29.0433 27.324L38.0892 40.2632H34.3767L26.995 29.7048V29.7042Z"
                            fill="white"
                        ></path>
                    </svg>
                ),
                link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent('Check out this deal!')}`,
                color: 'bg-black hover:bg-black/90 text-white',
            },
            {
                name: 'WhatsApp',
                icon: FaWhatsapp,
                link: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
                color: 'bg-[#25D366] hover:bg-[#25D366]/90 text-white',
            },
            {
                name: 'Pinterest',
                icon: FaPinterest,
                link: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent('Great deal found!')}`,
                color: 'bg-[#BD081C] hover:bg-[#BD081C]/90 text-white',
            },
        ],
        [shareUrl, handleCopyLink],
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="md:text-[15px] gap-2 hover:text-primary focus-visible:ring-0"
                >
                    <Share2 className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
                    <span>Share</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="center" className="flex gap-3 p-3 rounded-2xl shadow-sm">
                {shareOptions.map(({ name, icon: Icon, color, link, action }) => (
                    <DropdownMenuItem key={name} className="px-0 focus:bg-transparent cursor-pointer group" asChild>
                        {link ? (
                            <a href={link} target="_blank" rel="noopener noreferrer">
                                <ShareItem Icon={Icon} color={color} label={name} />
                            </a>
                        ) : (
                            <button onClick={action} className="outline-none">
                                <ShareItem Icon={Icon} color={color} label={name} />
                            </button>
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DealShare;
