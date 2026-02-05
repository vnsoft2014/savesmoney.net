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
        discountPrice: z.number().min(0, 'Discount price must be >= 0'),

        percentageOff: z.string().optional(),

        purchaseLink: z.string().url('Invalid URL'),

        description: z.string().refine((val) => stripHtmlTags(val).length > 0, 'Description is required'),
        tags: z.array(z.string().min(1)).optional(),

        hotTrend: z.boolean().optional(),
        holidayDeals: z.boolean().optional(),
        seasonalDeals: z.boolean().optional(),
    })
    .superRefine((data, ctx) => {
        const { originalPrice, discountPrice } = data;

        if (originalPrice !== null && discountPrice !== null && discountPrice > originalPrice) {
            ctx.addIssue({
                path: ['discountPrice'],
                message: 'Discount price must be less than or equal to original price',
                code: z.ZodIssueCode.custom,
            });
        }
    });

export type DealForm = z.infer<typeof dealSchema>;
