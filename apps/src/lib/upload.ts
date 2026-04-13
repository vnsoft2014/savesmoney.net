import { Image } from '@/models/Image';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE, MAX_IMAGE_SIZE, MAX_THUMBNAIL_SIZE } from '@/config/upload';
import connectDB from '@/lib/db/connectDB';

interface BaseUploadOptions {
    width?: number;
    height?: number;
    folder?: string;
    uploadedBy?: string;
    type?: 'avatar' | 'thumbnail' | 'image';
    slug?: string;
}

export async function uploadImage(file: File, options: BaseUploadOptions = {}) {
    await connectDB();

    const { width = 800, height, folder = 'uploads', uploadedBy, type = 'image', slug } = options;

    let outputPath: string | null = null;

    try {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            throw new Error('INVALID_IMAGE_TYPE');
        }

        let maxSize = MAX_IMAGE_SIZE;
        if (type === 'avatar') maxSize = MAX_AVATAR_SIZE;
        if (type === 'thumbnail') maxSize = MAX_THUMBNAIL_SIZE;

        if (file.size > maxSize) {
            throw new Error('IMAGE_TOO_LARGE');
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const safeSlug = slug
            ? slug
                  .toLowerCase()
                  .normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/[^a-z0-9]+/g, '-')
                  .replace(/(^-|-$)/g, '')
            : 'image';

        const fileName = `${safeSlug}-${uuidv4().slice(0, 8)}.webp`;

        const uploadDir = path.join(process.cwd(), 'public', folder);
        await fs.mkdir(uploadDir, { recursive: true });

        outputPath = path.join(uploadDir, fileName);

        await sharp(buffer)
            .resize(width, height, {
                fit: 'inside',
                withoutEnlargement: true,
            })
            .webp({ quality: 80 })
            .toFile(outputPath);

        const url = `/${folder}/${fileName}`;

        const image = await Image.create({
            url,
            fileName,
            mimeType: 'image/webp',
            size: file.size,
            uploadedBy,
        });

        return {
            id: image._id,
            url,
        };
    } catch (error) {
        console.error('Upload error:', error);

        if (outputPath) {
            try {
                await fs.unlink(outputPath);
            } catch (cleanupError) {
                console.error('Cleanup failed:', cleanupError);
            }
        }

        throw error;
    }
}

interface UploadImageOptions {
    file: File;
    fileName: string;
    oldImage?: string | null;
    allowedTypes?: string[];
    maxSizeMB?: number;
    uploadFolder?: string;
    errorPrefix?: string;
}

export async function uploadImageNormal({
    file,
    fileName,
    oldImage,
    allowedTypes = ALLOWED_IMAGE_TYPES,
    maxSizeMB = 0.5,
    uploadFolder = 'uploads/avatars',
    errorPrefix = 'IMAGE',
}: UploadImageOptions): Promise<string> {
    const maxSize = maxSizeMB * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
        throw new Error(`INVALID_${errorPrefix}_TYPE`);
    }

    if (file.size > maxSize) {
        throw new Error(`${errorPrefix}_TOO_LARGE`);
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', uploadFolder);
    await fs.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    fileName = `${fileName}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await fs.writeFile(filePath, buffer);

    if (oldImage) {
        const oldPath = path.join(process.cwd(), 'public', oldImage);
        fs.unlink(oldPath).catch(() => null);
    }

    return `/${uploadFolder}/${fileName}`;
}

interface DealUploadOptions {
    resize?: {
        width: number;
        height: number;
    };
    uploadedBy: string;
}

export async function uploadDealImage(file: File, options: DealUploadOptions) {
    const { resize, uploadedBy } = options;

    const now = new Date();
    const year = now.getFullYear().toString();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const folder = `uploads/deals/${year}/${month}`;

    const result = await uploadImage(file, {
        width: resize?.width,
        height: resize?.height,
        folder,
        uploadedBy,
        slug: 'deal',
    });

    return result.url;
}
