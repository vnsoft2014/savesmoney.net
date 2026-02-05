import * as z from 'zod';

export const signUpSchema = z
    .object({
        name: z.string().min(2, 'Name must be at least 2 characters long'),
        email: z.string().min(1, 'Email is required').email('Invalid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters long')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                'Include uppercase, lowercase, number and special character',
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        agreeTerms: z.literal(true, {
            message: 'You must agree to the Terms and Conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

export type SignUpForm = z.infer<typeof signUpSchema>;
