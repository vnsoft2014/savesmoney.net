import * as z from 'zod';

export const contactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email'),
    radio: z.string().optional(),
    message: z.string().optional(),
    checkboxes: z.array(z.string()).optional(),
});

export type ContactForm = z.infer<typeof contactFormSchema>;
