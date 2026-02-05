import * as z from 'zod';

export const dealAlertSchema = z.object({
    keywords: z.string().min(1, 'Please enter keywords.'),
    channel: z.enum(['email']),
    name: z.string().min(1, 'Please enter your name.'),
    email: z.string().email('Please enter a valid email.'),
});

export type DealAlertForm = z.infer<typeof dealAlertSchema>;
