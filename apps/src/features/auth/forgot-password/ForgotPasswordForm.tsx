'use client';

import { forgotPassword } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Lock, Mail } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/shadecn/ui/field';
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
        defaultValues: { email: '' },
        mode: 'onChange',
    });

    const {
        handleSubmit,
        control,
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

    if (isEmailSent) {
        return (
            <div className="min-h-[90vh] flex items-center justify-center px-3 py-6">
                <Card className="w-full max-w-150 p-4 md:p-8 border border-gray-100 shadow-xs">
                    <CardHeader className="text-center space-y-4">
                        <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
                            <Mail className="w-8 h-8 text-green-600" />
                        </div>

                        <CardTitle>Check Your Email</CardTitle>

                        <CardDescription>
                            We've sent a password reset link to{' '}
                            <span className="font-semibold text-foreground">{sentEmail}</span>
                        </CardDescription>

                        <p className="text-xs text-muted-foreground">
                            Didn't receive the email? Check your spam folder or try again.
                        </p>
                    </CardHeader>

                    <CardContent className="flex gap-4">
                        <Button onClick={() => setIsEmailSent(false)} className="w-full">
                            Resend Email
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/signin')}
                            className="w-full flex items-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Sign In
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
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Forgot Password?</CardTitle>

                        <CardDescription className="text-gray-600">
                            No worries, we'll send you reset instructions
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid} className="gap-2">
                                        <FieldLabel htmlFor="email" className="text-gray-700">
                                            Email
                                        </FieldLabel>

                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <Input
                                                {...field}
                                                id="email"
                                                type="email"
                                                placeholder="your@email.com"
                                                className="pl-10 h-12"
                                                aria-invalid={fieldState.invalid}
                                            />
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
                                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Send Reset Link'}
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

export default ForgotPasswordForm;
