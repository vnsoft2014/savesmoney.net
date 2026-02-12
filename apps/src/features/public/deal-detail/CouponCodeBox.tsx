'use client';

import { Button } from '@/shared/shadecn/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Props = {
    code: string;
};

export default function CouponCodeBox({ code }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full flex items-center justify-between gap-3 p-3 border border-dashed rounded-md bg-orange-50">
            <div className="text-sm">
                <div className="text-gray-600 mb-1 font-bold">Coupon Code</div>
                <div className="font-sans font-bold text-orange-700 text-base md:text-lg tracking-wider">{code}</div>
            </div>

            <Button size="sm" variant="outline" onClick={handleCopy} className="flex items-center gap-1">
                {copied ? (
                    <>
                        <Check className="w-4 h-4 text-green-600" />
                        Copied
                    </>
                ) : (
                    <>
                        <Copy className="w-4 h-4" />
                        Copy
                    </>
                )}
            </Button>
        </div>
    );
}
