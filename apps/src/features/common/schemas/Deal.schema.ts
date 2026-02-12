import { stripHtmlTags } from '@/utils/utils';
import * as z from 'zod';

export const dealSchema = z
    .object({
        picture: z.string().min(1, 'Picture is required'),
        dealType: z.array(z.string()).min(1, 'Deal Type is required'),
        store: z.string().min(1, 'Deal Store is required'),

        expiredDate: z.string().nullable(),
        disableExpireAt: z.boolean().optional(),
        coupon: z.boolean().optional(),
        clearance: z.boolean().optional(),

        shortDescription: z.string().min(1, 'Short description is required'),

        originalPrice: z.number().positive('Original price must be > 0'),
        discountPrice: z
            .union([z.number(), z.null()])
            .optional()
            .refine((val) => val === null || val === undefined || val >= 0, 'Discount price must be >= 0'),

        percentageOff: z.string().optional(),

        purchaseLink: z.string().url('Invalid URL'),

        description: z.string().refine((val) => stripHtmlTags(val).length > 0, 'Description is required'),
        flashDeal: z.boolean().optional(),
        flashDealExpireHours: z.number().nullable(),
        couponCode: z.string().optional(),
        tags: z.array(z.string()).optional(),

        hotTrend: z.boolean().optional(),
        holidayDeals: z.boolean().optional(),
        seasonalDeals: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        const { originalPrice, discountPrice } = data;

        if (typeof discountPrice === 'number' && discountPrice > originalPrice) {
            ctx.addIssue({
                path: ['discountPrice'],
                message: 'Discount price must be less than or equal to original price',
                code: z.ZodIssueCode.custom,
            });
        }

        if (data.flashDeal && !data.flashDealExpireHours) {
            ctx.addIssue({
                path: ['flashDealExpireHours'],
                message: 'Expiration hours is required for flash deal',
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type DealForm = z.infer<typeof dealSchema>;
