import { MESSAGES } from '@/constants/messages';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

type RateLimitConfig = {
    requests: number;
    duration: `${number} s` | `${number} m` | `${number} h`;
    analytics?: boolean;
};

const redis = Redis.fromEnv();

export function createRateLimiter({ requests, duration, analytics = true }: RateLimitConfig) {
    return new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(requests, duration),
        analytics,
    });
}

export async function enforceRateLimit(req: Request, limiter: Ratelimit): Promise<NextResponse | null> {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';

    const { success, limit, reset, remaining } = await limiter.limit(ip);

    if (success) return null;

    return NextResponse.json(
        {
            success: false,
            message: MESSAGES.WARNING.RATE_LIMIT,
        },
        {
            status: 429,
            headers: {
                'X-RateLimit-Limit': limit.toString(),
                'X-RateLimit-Remaining': remaining.toString(),
                'X-RateLimit-Reset': reset.toString(),
            },
        },
    );
}
