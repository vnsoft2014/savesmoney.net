'use client';

import { useEffect, useState } from 'react';

type Props = {
    expireAt: string;
};

type RemainingTime = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export function getRemainingTime(flashDealExpireAt?: string | Date | null): RemainingTime | null {
    if (!flashDealExpireAt) return null;

    const expireTime =
        flashDealExpireAt instanceof Date ? flashDealExpireAt.getTime() : new Date(flashDealExpireAt).getTime();

    if (isNaN(expireTime)) return null;

    const diff = expireTime - Date.now();

    if (diff <= 0) return null;

    const totalSeconds = Math.floor(diff / 1000);

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds };
}

export default function FlashDealCountdown({ expireAt }: Props) {
    const [time, setTime] = useState<RemainingTime | null>(() => getRemainingTime(expireAt));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(getRemainingTime(expireAt));
        }, 1000);

        return () => clearInterval(timer);
    }, [expireAt]);

    if (!time) return <span>expired</span>;

    return (
        <>
            {time.days > 0 && (
                <>
                    <span>{String(time.days).padStart(2, '0')}</span>
                    <span>:</span>
                </>
            )}
            <span>{String(time.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(time.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span>{String(time.seconds).padStart(2, '0')}</span>
        </>
    );
}
