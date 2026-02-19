'use client';

import { Button } from '@/shared/shadecn/ui/button';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';

type Props = {
    code: string;
    comment?: string;
};

export default function CouponCodeBox({ code, comment }: Props) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-orange-200">
            <div className="flex items-center gap-3 min-w-0">
                <div className="font-mono font-semibold text-orange-700 text-xs md:text-sm tracking-wider">{code}</div>

                {comment && <div className="text-xs text-gray-600 truncate max-w-50 md:max-w-xs">{comment}</div>}
            </div>

            <Button size="icon" variant="outline" onClick={handleCopy} className="w-5 h-5 shadow-none border-none">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
        </div>
    );
}
