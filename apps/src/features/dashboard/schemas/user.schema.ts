import { MESSAGES } from '@/config/messages';
import { ALLOWED_IMAGE_TYPES, MAX_AVATAR_SIZE } from '@/config/upload';
import { USER_ROLES } from '@/config/user';

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
        .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
        .refine((file) => !file || file.size <= MAX_AVATAR_SIZE, 'Avatar must be less than 500KB'),
});

export type AddUserForm = z.infer<typeof addUserSchema>;

export const editUserSchema = z
    .object({
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
        isBlocked: z.boolean(),
        blockReason: z.string().optional(),
        avatar: z
            .union([z.instanceof(File), z.null()])
            .optional()
            .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
            .refine((file) => !file || file.size <= MAX_AVATAR_SIZE, 'Avatar must be less than 500KB'),
    })
    .refine((data) => !data.isBlocked || !!data.blockReason?.trim(), {
        message: 'Block reason is required when user is blocked',
        path: ['blockReason'],
    });

export type EditUserForm = z.infer<typeof editUserSchema>;
