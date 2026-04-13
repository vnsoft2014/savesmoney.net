'use client';

import { resetPassword } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, KeyRound, Loader2, Lock } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/shadecn/ui/field';
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
        mode: 'onChange',
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

        const res = await resetPassword(token, values.password);

        if (res.success) {
            setIsSuccess(true);
            toast.success(res.message || 'Password reset successfully');
        } else {
            toast.error(res.message);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <Card className="w-full max-w-md shadow-xl">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                            <KeyRound className="w-8 h-8 text-green-600" />
                        </div>

                        <CardTitle>Password Updated</CardTitle>
                        <CardDescription>Your password has been reset successfully.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <Button onClick={() => router.push('/signin')} className="w-full">
                            Go to Sign In
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-3 py-6">
            <Card className="w-full max-w-150 p-4 md:p-8 border border-gray-100 shadow-xs">
                <CardHeader className="space-y-4 text-center mb-6">
                    <div className="mx-auto p-3 bg-indigo-100 rounded-full w-fit">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Reset Password</CardTitle>
                        <CardDescription className="text-gray-600">Enter your new password below</CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel htmlFor="password" className="text-gray-700">
                                            New Password
                                        </FieldLabel>

                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="New password"
                                                className="pr-10 h-12"
                                                aria-invalid={fieldState.invalid}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="confirmPassword"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel htmlFor="confirm-password" className="text-gray-700">
                                            Confirm Password
                                        </FieldLabel>

                                        <div className="relative">
                                            <Input
                                                {...field}
                                                id="confirm-password"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Confirm password"
                                                className="pr-10 h-12"
                                                aria-invalid={fieldState.invalid}
                                            />

                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword((v) => !v)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="w-5 h-5" />
                                                ) : (
                                                    <Eye className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-12 font-semibold shadow-lg"
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset Password'}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => router.push('/signin')}
                                className="w-full flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Button>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ResetPasswordForm;
