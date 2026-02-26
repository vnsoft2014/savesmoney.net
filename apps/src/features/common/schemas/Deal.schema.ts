import { MESSAGES } from '@/constants/messages';
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from '@/constants/upload';
import { stripHtml } from '@/utils/sanitize';
import * as z from 'zod';

export const addDealSchema = z
    .object({
        picture: z
            .instanceof(File, { message: 'Thumbnail is required' })
            .refine((file) => ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
            .refine((file) => file.size <= MAX_IMAGE_SIZE, 'Thumbnail must be less than 5MB'),
        dealType: z.array(z.string()).min(1, 'Deal Type is required'),
        store: z.string().min(1, 'Deal Store is required'),

        expiredDate: z.string().nullable().optional(),
        disableExpireAt: z.boolean().optional(),
        coupon: z.boolean().optional(),
        coupons: z.array(
            z.object({
                code: z.string().min(1, 'Coupon code is required'),
                comment: z.string().min(1, 'Comment is required'),
            }),
        ),
        clearance: z.boolean().optional(),

        shortDescription: z
            .string()
            .trim()
            .min(5, { message: 'Minimum 5 characters required' })
            .max(500, { message: 'Maximum 500 characters allowed' }),

        originalPrice: z.number().positive('Original price must be > 0'),
        discountPrice: z
            .union([z.number(), z.null()])
            .optional()
            .refine((val) => val === null || val === undefined || val >= 0, 'Discount price must be >= 0'),

        percentageOff: z.string().optional(),

        purchaseLink: z.string().url('Invalid URL'),

        description: z.string().refine((val) => stripHtml(val).length > 0, 'Description is required'),
        flashDeal: z.boolean().optional(),
        flashDealExpireHours: z.number().nullable(),

        tags: z.array(z.string()).optional(),

        hotTrend: z.boolean().optional(),
        holidayDeals: z.boolean().optional(),
        seasonalDeals: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        const {
            originalPrice,
            discountPrice,
            flashDeal,
            flashDealExpireHours,
            expiredDate,
            disableExpireAt,
            coupon,
            clearance,
        } = data;

        if (typeof discountPrice === 'number' && discountPrice > originalPrice) {
            ctx.addIssue({
                path: ['discountPrice'],
                message: 'Discount price must be less than or equal to original price',
                code: z.ZodIssueCode.custom,
            });
        }

        if (flashDeal && (flashDealExpireHours == null || flashDealExpireHours === 0)) {
            ctx.addIssue({
                path: ['flashDealExpireHours'],
                message: 'Expiration hours must be greater than 0 for flash deal',
                code: z.ZodIssueCode.custom,
            });
        }

        const shouldRequireExpired = !disableExpireAt && !coupon && !clearance && !flashDeal;

        if (shouldRequireExpired && !expiredDate) {
            ctx.addIssue({
                path: ['expiredDate'],
                message: 'Expiry date is required',
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type AddDealForm = z.infer<typeof addDealSchema>;

export const editDealSchema = z
    .object({
        picture: z
            .instanceof(File)
            .optional()
            .refine((file) => !file || ALLOWED_IMAGE_TYPES.includes(file.type), MESSAGES.IMAGE.INVALID_TYPE)
            .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, 'Thumbnail must be less than 5MB'),
        dealType: z.array(z.string()).min(1, 'Deal Type is required'),
        store: z.string().min(1, 'Deal Store is required'),

        expiredDate: z.string().nullable().optional(),
        disableExpireAt: z.boolean().optional(),
        coupon: z.boolean().optional(),
        coupons: z
            .array(
                z.object({
                    code: z.string().min(1, 'Coupon code is required'),
                    comment: z.string().min(1, 'Comment is required'),
                }),
            )
            .optional(),
        clearance: z.boolean().optional(),

        shortDescription: z
            .string()
            .trim()
            .min(5, { message: 'Minimum 5 characters required' })
            .max(500, { message: 'Maximum 500 characters allowed' }),

        originalPrice: z.number().positive('Original price must be > 0'),
        discountPrice: z
            .union([z.number(), z.null()])
            .optional()
            .refine((val) => val === null || val === undefined || val >= 0, 'Discount price must be >= 0'),

        percentageOff: z.string().optional(),

        purchaseLink: z.string().url('Invalid URL'),

        description: z.string().refine((val) => stripHtml(val).length > 0, 'Description is required'),
        flashDeal: z.boolean().optional(),
        flashDealExpireHours: z.number().nullable(),

        tags: z.array(z.string()).optional(),

        hotTrend: z.boolean().optional(),
        holidayDeals: z.boolean().optional(),
        seasonalDeals: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        const {
            originalPrice,
            discountPrice,
            flashDeal,
            flashDealExpireHours,
            expiredDate,
            disableExpireAt,
            coupon,
            clearance,
        } = data;

        if (typeof discountPrice === 'number' && discountPrice > originalPrice) {
            ctx.addIssue({
                path: ['discountPrice'],
                message: 'Discount price must be less than or equal to original price',
                code: z.ZodIssueCode.custom,
            });
        }

        if (flashDeal && (flashDealExpireHours == null || flashDealExpireHours === 0)) {
            ctx.addIssue({
                path: ['flashDealExpireHours'],
                message: 'Expiration hours must be greater than 0 for flash deal',
                code: z.ZodIssueCode.custom,
            });
        }

        const shouldRequireExpired = !disableExpireAt && !coupon && !clearance && !flashDeal;

        if (shouldRequireExpired && !expiredDate) {
            ctx.addIssue({
                path: ['expiredDate'],
                message: 'Expiry date is required',
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type EditDealForm = z.infer<typeof editDealSchema>;
