import * as z from 'zod';

export const signInSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    rememberMe: z.boolean(),
});

export type SignInForm = z.infer<typeof signInSchema>;
