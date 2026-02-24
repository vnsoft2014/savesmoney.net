import { MESSAGES } from '@/constants/messages';
import { ALLOWED_IMAGE_TYPES, MAX_THUMBNAIL_SIZE } from '@/constants/upload';
import * as z from 'zod';

export const addUserStoreSchema = z.object({
    name: z
        .string()
        .min(3, 'Store name must be at least 3 characters')
        .max(60, 'Store name must be less than 60 characters'),
    website: z
        .string()
        .trim()
        .max(50, 'Website URL must be less than 50 characters')
        .refine(
            (val) => {
                if (val === '') return true;
                try {
                    const testVal = val.startsWith('http') ? val : `https://${val}`;
                    new URL(testVal);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: 'Invalid website URL' },
        ),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(300, 'Description must be less than 300 characters'),
    logo: z
        .instanceof(File, { message: 'Thumbnail is required' })
        .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
        .refine((file) => file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be less than 500KB'),
});

export type AddUserStoreForm = z.infer<typeof addUserStoreSchema>;

export const editUserStoreSchema = z.object({
    name: z
        .string()
        .min(3, 'Store name must be at least 3 characters')
        .max(60, 'Store name must be less than 60 characters'),
    website: z
        .string()
        .trim()
        .max(50, 'Website URL must be less than 50 characters')
        .refine(
            (val) => {
                if (val === '') return true;
                try {
                    const testVal = val.startsWith('http') ? val : `https://${val}`;
                    new URL(testVal);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: 'Invalid website URL' },
        ),
    description: z
        .string()
        .min(10, 'Description must be at least 10 characters')
        .max(300, 'Description must be less than 300 characters'),
    logo: z
        .instanceof(File)
        .optional()
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
        .refine((file) => !file || file.size <= MAX_THUMBNAIL_SIZE, 'Thumbnail must be less than 500KB'),
});

export type EditUserStoreForm = z.infer<typeof editUserStoreSchema>;
