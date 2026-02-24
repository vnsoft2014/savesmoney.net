import { uploadImage } from '@/lib/upload';

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
