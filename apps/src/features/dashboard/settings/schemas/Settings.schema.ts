import * as z from 'zod';

export const socialLinksSchema = z.object({
    facebookPage: z.string().optional(),
    facebookGroup: z.string().optional(),
    x: z.string().optional(),
    instagram: z.string().optional(),
    linkedin: z.string().optional(),
});

export const settingsSchema = z.object({
    logo: z.string().optional(),
    favicon: z.string().optional(),
    websiteTitle: z.string().min(1, 'Website Title is required'),
    websiteDescription: z.string().min(1, 'Website Description is required'),
    holidayDealsLabel: z.string().optional(),
    seasonalDealsLabel: z.string().optional(),
    adminEmail: z.string().email('Invalid email format'),
    socialLinks: socialLinksSchema,
});

export type SettingsForm = z.infer<typeof settingsSchema>;
