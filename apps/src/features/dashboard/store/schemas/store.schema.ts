import { ALLOWED_IMAGE_TYPES, MAX_THUMBNAIL_SIZE } from '@/constants/upload';
import * as z from 'zod';

export const storeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    thumbnail: z
        .union([z.instanceof(File), z.null()])
        .optional()
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), 'Only JPG, PNG or WEBP allowed')
        .refine((file) => !file || file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be less than 500KB'),
});

export type StoreForm = z.infer<typeof storeSchema>;
