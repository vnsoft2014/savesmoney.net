import { MESSAGES } from '@/constants/messages';
import { USER_ROLES } from '@/constants/user';
import { assertRole, authCheck } from '@/middleware/authCheck';
import { createRateLimiter, enforceRateLimit } from '@/utils/rarelimit';
import { checkFile } from '@/utils/validators/file-checker';
import { existsSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import sharp from 'sharp';

const uploadImageLimiter = createRateLimiter({
    requests: 3,
    duration: '1 m',
});

export async function POST(req: Request) {
    const rateLimitResponse = await enforceRateLimit(req, uploadImageLimiter);

    if (rateLimitResponse) return rateLimitResponse;

    try {
        const role = await authCheck(req);
        if (!assertRole(role, USER_ROLES)) {
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

        const fileValid = checkFile(file);
        if (!fileValid.isValid) {
            NextResponse.json({ success: false, message: fileValid.message }, { status: 400 });
        }

        const timestamp = Date.now();
        const originalName = file.name.replace(/\s+/g, '-');
        const filename = `${timestamp}-${originalName}`;

        const now = new Date();
        const year = now.getFullYear().toString();
        const month = String(now.getMonth() + 1).padStart(2, '0');

        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'deals', year, month);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = new Uint8Array(arrayBuffer);

        const originalPath = path.join(uploadDir, filename);
        await writeFile(originalPath, buffer);

        const ext = path.extname(filename);
        const nameWithoutExt = path.basename(filename, ext);
        const resizedFilename = `${nameWithoutExt}_resized${ext}`;
        const resizedPath = path.join(uploadDir, resizedFilename);

        const resizedBuffer = await sharp(buffer)
            .resize({ width: 350, height: 350, withoutEnlargement: true })
            .toBuffer();

        await writeFile(resizedPath, new Uint8Array(resizedBuffer));

        const publicUrlResized = `/uploads/deals/${year}/${month}/${resizedFilename}`;

        return NextResponse.json({
            success: true,
            data: {
                url: publicUrlResized,
                filename,
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
