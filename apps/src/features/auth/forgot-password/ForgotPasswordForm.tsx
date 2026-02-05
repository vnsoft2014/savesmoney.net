'use client';

import { forgotPassword } from '@/services/common/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';

const forgotPasswordSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm = () => {
    const router = useRouter();
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [sentEmail, setSentEmail] = useState('');

    const form = useForm<ForgotPasswordValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: ForgotPasswordValues) => {
        try {
            const res = await forgotPassword(values.email);

            if (res.success) {
                setSentEmail(values.email);
                setIsEmailSent(true);
                toast.success(res.message);
            } else {
                toast.error(res.message);
            }
        } catch {
            toast.error('Failed to send reset link. Please try again.');
        }
    };

    if (!isEmailSent) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-150 p-8">
                    <div className="text-center">
                        <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>

                        <h1 className="font-bold text-gray-800 mb-2">Check Your Email</h1>

                        <p className="mb-2! text-sm md:text-base text-gray-600">
                            We've sent a password reset link to{' '}
                            <span className="font-semibold text-gray-800">{sentEmail}</span>
                        </p>

                        <p className="text-sm md:text-xs text-gray-500">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>

                        <div className="flex items-center justify-between gap-4 mt-8">
                            <Button onClick={() => setIsEmailSent(false)} className="w-full">
                                Resend Email
                            </Button>

                            <Button
                                variant="outline"
                                onClick={() => router.push('/signin')}
                                className="w-full text-gray-600 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-150 p-8">
                <div className="text-center mb-8">
                    <div className="inline-block p-3 bg-indigo-100 rounded-full mb-4">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>

                    <h1 className="font-bold text-gray-800 mb-2">Forgot Password?</h1>
                    <p className="text-sm md:text-base text-gray-600">No worries, we'll send you reset instructions</p>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                {...field}
                                                type="email"
                                                placeholder="your@email.com"
                                                className="pl-10 text-sm"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isSubmitting} className="w-full font-semibold">
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Send Reset Link'}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => router.push('/signin')}
                            className="w-full flex items-center gap-2 text-gray-600"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default ForgotPasswordForm;
