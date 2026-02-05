'use client';

import { resetPassword } from '@/services/common/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(strongPasswordRegex, 'Password must include uppercase, lowercase, number and special character'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const form = useForm<ResetPasswordValues>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: '',
            confirmPassword: '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: ResetPasswordValues) => {
        if (!token) {
            toast.error('Invalid or missing reset token');
            return;
        }

        try {
            const res = await resetPassword(token, values.password);

            if (res.success) {
                setIsSuccess(true);
                toast.success(res.message || 'Password reset successfully');
            } else {
                toast.error(res.message);
                return;
            }
        } catch {
            toast.error('Failed to reset password');
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-150 p-8 text-center">
                    <div className="inline-block p-3 bg-green-100 rounded-full mb-4">
                        <KeyRound className="w-8 h-8 text-green-600" />
                    </div>

                    <h1 className="font-bold text-gray-800 mb-2">Password Updated</h1>
                    <p className="text-sm md:text-base text-gray-600 mb-8">
                        Your password has been reset successfully.
                    </p>

                    <Button onClick={() => router.push('/signin')} className="w-full bg-indigo-600 hover:bg-indigo-700">
                        Go to Sign In
                    </Button>
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

                    <h1 className="font-bold text-gray-800 mb-2">Reset Password</h1>
                    <p className="text-sm md:text-base text-gray-600">Enter your new password below</p>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                className="text-sm"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="New password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                {...field}
                                                className="text-sm"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-indigo-600 hover:bg-indigo-700"
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
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

export default ResetPasswordForm;
