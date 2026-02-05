import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from '@/constants/upload';
import * as z from 'zod';

export const profileSchema = z.object({
    name: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(50, 'Full name must be less than 50 characters'),
    email: z.string().email('Invalid email format'),
    avatar: z
        .any()
        .optional()
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), 'Only JPG, PNG or WEBP images are allowed')
        .refine((file) => !file || file.size <= MAX_AVATAR_SIZE, 'Avatar must be less than 0.5MB'),
});

export type ProfileForm = z.infer<typeof profileSchema>;
