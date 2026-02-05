import { ALLOWED_IMAGE_TYPES } from '@/constants/upload';
import fs from 'fs/promises';
import path from 'path';

export const maxSize = (value: File) => {
    const fileSize = value.size / 1024 / 1024;
    return fileSize < 1 ? false : true;
};

export const uploadImageToServer = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.message || 'Upload failed');
    }

    return data.url;
};

interface UploadImageOptions {
    file: File;
    fileName: string;
    oldImage?: string | null;
    allowedTypes?: string[];
    maxSizeMB?: number;
    uploadFolder?: string;
    errorPrefix?: string;
}

export async function uploadImage({
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
