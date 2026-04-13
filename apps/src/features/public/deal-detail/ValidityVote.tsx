'use client';

import { cn, fetcher } from '@/lib/utils';
import { Button } from '@/shared/shadecn/ui/button';
import { memo, useCallback, useEffect, useState } from 'react';

type IconProps = {
    className?: string;
};

const ThumbUpOutline = ({ className }: IconProps) => {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
            <path d="M7 10v12" />
        </svg>
    );
};

const ThumbUpFilled = ({ className }: IconProps) => {
    return (
        <svg viewBox="0 0 24 24" className={className}>
            <path
                fill="currentColor"
                d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
            />

            <path d="M7 10v12" stroke="white" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
};

type VoteType = 'valid' | 'invalid';

type Props = {
    dealId: string;
};

const COOLDOWN_MS = 6 * 60 * 60 * 1000;

const ValidityVote = ({ dealId }: Props) => {
    const [voted, setVoted] = useState<VoteType | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [votingType, setVotingType] = useState<VoteType | null>(null);

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
            if (disabled || votingType) return;

            try {
                setVotingType(vote);

                const res = await fetcher(`${process.env.NEXT_PUBLIC_API_BASE_URL}/common/deal/${dealId}/validity`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ vote }),
                });

                if (!res.success) return;

                localStorage.setItem(`vote_validity_${dealId}`, JSON.stringify({ vote, time: Date.now() }));

                setVoted(vote);
                setDisabled(true);
            } finally {
                setVotingType(null);
            }
        },
        [dealId, disabled, votingType],
    );

    const isBlocked = disabled || !!votingType;

    const buttonClass = 'cursor-not-allowed opacity-60';

    return (
        <div className="flex items-center gap-1">
            <span className="mr-2 text-sm md:text-base font-medium text-muted-foreground">
                Is this deal still valid?
            </span>

            <Button
                variant="ghost"
                size="sm"
                disabled={isBlocked}
                onClick={() => onVote('valid')}
                className={cn(
                    'h-auto gap-1.5 px-2 py-1 text-green-600 hover:text-green-700 hover:bg-green-50 disabled:opacity-100',
                    voted === 'valid' && 'bg-green-50',
                    votingType === 'valid' && 'opacity-40! cursor-not-allowed',
                )}
            >
                {voted === 'valid' || votingType === 'valid' ? (
                    <ThumbUpFilled className="w-6 h-6 md:w-7 md:h-7" />
                ) : (
                    <ThumbUpOutline className="w-5 h-5 md:w-6 md:h-6" />
                )}
                <span className="text-sm md:text-base">Yes</span>
            </Button>

            <Button
                variant="ghost"
                size="sm"
                disabled={isBlocked}
                onClick={() => onVote('invalid')}
                className={cn(
                    'h-auto gap-1.5 px-2 py-1 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-100',
                    voted === 'invalid' && 'bg-red-50',
                    votingType == 'invalid' && 'opacity-40! cursor-not-allowed',
                )}
            >
                {voted === 'invalid' || votingType === 'invalid' ? (
                    <ThumbUpFilled className="w-6 h-6 md:w-7 md:h-7 rotate-180" />
                ) : (
                    <ThumbUpOutline className="w-5 h-5 md:w-6 md:h-6 rotate-180" />
                )}
                <span className="text-sm md:text-base">No</span>
            </Button>
        </div>
    );
};

export default memo(ValidityVote);
