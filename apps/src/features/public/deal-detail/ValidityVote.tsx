'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/shared/shadecn/ui/button';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { memo, useCallback, useEffect, useState } from 'react';

type VoteType = 'valid' | 'invalid';

type Props = {
    dealId: string;
};

const COOLDOWN_MS = 6 * 60 * 60 * 1000;

const ValidityVote = ({ dealId }: Props) => {
    const [voted, setVoted] = useState<VoteType | null>(null);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        const raw = localStorage.getItem(`vote_validity_${dealId}`);
        if (!raw) return;

        const { vote, time } = JSON.parse(raw);
        if (Date.now() - time < COOLDOWN_MS) {
            setVoted(vote);
            setDisabled(true);
        }
    }, [dealId]);

    const onVote = useCallback(
        async (vote: VoteType) => {
            if (disabled) return;

            setDisabled(true);

            const res = await fetch(`/api/common/deal/${dealId}/validity`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ vote }),
            });

            const data = await res.json();
            if (!data.success) return;

            localStorage.setItem(`vote_validity_${dealId}`, JSON.stringify({ vote, time: Date.now() }));

            setVoted(vote);
        },
        [dealId, disabled],
    );

    const buttonClass = 'cursor-not-allowed opacity-60';

    return (
        <div className="flex items-center gap-1">
            <span className="text-sm md:text-base font-medium text-muted-foreground">Is this deal still valid?</span>

            <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => onVote('valid')}
                className={cn(
                    'h-8 gap-1.5 text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-100',
                    voted === 'valid' && 'bg-green-100',
                    disabled && buttonClass,
                )}
            >
                <ThumbsUp className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">Yes</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                disabled={disabled}
                onClick={() => onVote('invalid')}
                className={cn(
                    'h-8 gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-100',
                    voted === 'invalid' && 'bg-red-100',
                    disabled && buttonClass,
                )}
            >
                <ThumbsDown className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-sm md:text-base">No</span>
            </Button>
        </div>
    );
};

export default memo(ValidityVote);
