import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from '@/constants/upload';
import { USER_ROLES } from '@/constants/user';

import * as z from 'zod';

export const addUserSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    role: z.enum(USER_ROLES),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Must contain uppercase letter')
        .regex(/[a-z]/, 'Must contain lowercase letter')
        .regex(/[0-9]/, 'Must contain a number')
        .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Must contain special character')
        .optional()
        .or(z.literal('')),
    avatar: z
        .union([z.instanceof(File), z.null()])
        .optional()
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), 'Only JPG, PNG or WEBP allowed')
        .refine((file) => !file || file.size <= MAX_AVATAR_SIZE, 'Avatar must be less than 500KB'),
});

export type AddUserForm = z.infer<typeof addUserSchema>;
