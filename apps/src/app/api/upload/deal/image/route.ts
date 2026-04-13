import { MESSAGES } from '@/config/messages';
import { ADMIN_ROLES } from '@/config/user';
import { createRateLimiter, enforceRateLimit } from '@/lib/rarelimit';
import { uploadDealImage } from '@/lib/upload';
import { assertRole, authCheck, authUser } from '@/middleware/authCheck';
import { NextResponse } from 'next/server';

const uploadImageLimiter = createRateLimiter({
    requests: 3,
    duration: '1 m',
});

export async function POST(req: Request) {
    const rateLimitResponse = await enforceRateLimit(req, uploadImageLimiter);

    if (rateLimitResponse) return rateLimitResponse;

    try {
        const role = await authCheck(req);
        if (!assertRole(role, ADMIN_ROLES)) {
            return NextResponse.json(
                {
                    success: false,
                    message: MESSAGES.ERROR.UNAUTHORIZED,
                },
                {
                    status: 403,
                },
            );
        }

        const formData = await req.formData();
        const file = formData.get('file') as File;

        let publicUrl = '';

        if (file instanceof File && file.size > 0) {
            try {
                const authenticated = await authUser(req);

                const author = authenticated!.sub;

                publicUrl = await uploadDealImage(file, {
                    resize: { width: 450, height: 450 },
                    uploadedBy: author!,
                });
            } catch (error: unknown) {
                const message = error instanceof Error ? error.message : '';

                if (message === 'INVALID_IMAGE_TYPE') {
                    return NextResponse.json({ success: false, message: 'Invalid thumbnail type' }, { status: 400 });
                }

                if (message === 'IMAGE_TOO_LARGE') {
                    return NextResponse.json(
                        { success: false, message: 'Thumbnail size must be less than 5MB' },
                        { status: 400 },
                    );
                }

                return NextResponse.json({ success: false, message: 'Upload thumbnail failed' }, { status: 500 });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                url: publicUrl,
            },
            message: 'Image uploaded',
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                message: MESSAGES.ERROR.INTERNAL_SERVER,
            },
            { status: 500 },
        );
    }
}
