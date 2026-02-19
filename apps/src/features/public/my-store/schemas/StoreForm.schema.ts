import * as z from 'zod';

export const userStoreSchema = z.object({
    name: z
        .string()
        .min(3, 'Store name must be at least 3 characters')
        .max(60, 'Store name must be less than 60 characters'),
    website: z
        .string()
        .trim()
        .max(255, 'Website URL must be less than 255 characters')
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
    logo: z.any().optional(),
});

export type UserStoreForm = z.infer<typeof userStoreSchema>;
