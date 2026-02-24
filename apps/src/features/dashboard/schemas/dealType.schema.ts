import { MESSAGES } from '@/constants/messages';
import { ALLOWED_IMAGE_TYPES, MAX_THUMBNAIL_SIZE } from '@/constants/upload';
import * as z from 'zod';

export const addDealTypeSchema = z.object({
    name: z.string().min(3, 'Name is required'),
    slug: z.string().min(3, 'Slug is required'),

    thumbnail: z
        .instanceof(File, { message: 'Thumbnail is required' })
        .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
        .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be less than 500KB'),
});

export type AddDealTypeForm = z.infer<typeof addDealTypeSchema>;

export const editDealTypeSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),

    thumbnail: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
        .refine((file) => !file || file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be less than 500KB'),
});

export type EditDealTypeForm = z.infer<typeof editDealTypeSchema>;
