'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import Link from 'next/link';
import { SocialAuthButtons } from '../components';
import { SignInForm as SignInFormType, signInSchema } from '../schemas/SignIn.schema';

const SignInForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);

    const redirectTo = searchParams.get('callbackUrl') || '/';

    const form = useForm<SignInFormType>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: SignInFormType) => {
        const res = await signIn('credentials', {
            email: values.email,
            password: values.password,
            rememberMe: values.rememberMe,
            redirect: false,
        });

        if (res?.error) {
            toast.error(res.error);
            return;
        }

        toast.success('Sign in successful');

        const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

        router.push(safeRedirect);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-3 py-6">
            <Card className="w-full max-w-150 p-4 md:p-8 border border-gray-100 shadow-xs">
                <CardHeader className="space-y-4 text-center mb-6">
                    <div className="mx-auto p-3 bg-indigo-100 rounded-full w-fit">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-2">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Sign In</CardTitle>
                        <CardDescription className="text-gray-600">Welcome To SavesMoney</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="signin-email" className="text-gray-700">
                                            Email
                                        </FieldLabel>

                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <Input
                                                {...field}
                                                id="signin-email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="your@email.com"
                                                className="pl-10 h-12"
                                                autoComplete="email"
                                            />
                                        </div>

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="gap-2" data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="signin-password" className="text-gray-700">
                                            Password
                                        </FieldLabel>

                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                                            <Input
                                                {...field}
                                                id="signin-password"
                                                aria-invalid={fieldState.invalid}
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="*********"
                                                className="pl-10 pr-10 h-12"
                                                autoComplete="current-password"
                                            />

                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                                <span className="sr-only">Toggle password visibility</span>
                                            </Button>
                                        </div>

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <div className="flex items-center justify-between">
                                <Controller
                                    name="rememberMe"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Field orientation="horizontal">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id="signin-remember"
                                            />

                                            <FieldLabel
                                                htmlFor="signin-remember"
                                                className="mb-0 text-sm font-normal text-gray-600 cursor-pointer"
                                            >
                                                Remember me?
                                            </FieldLabel>
                                        </Field>
                                    )}
                                />

                                <Link
                                    href="/forgot-password"
                                    className="shrink-0 text-sm text-indigo-600 hover:underline font-semibold"
                                    prefetch={false}
                                >
                                    Forgot Password?
                                </Link>
                            </div>

                            <Button type="submit" className="w-full h-12 font-semibold" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm text-gray-600">
                                Don’t have an account?{' '}
                                <Link
                                    href={`/signup?redirect=${encodeURIComponent(redirectTo)}`}
                                    className="text-indigo-600 hover:underline font-semibold"
                                    prefetch={false}
                                >
                                    Sign Up
                                </Link>
                            </div>
                        </FieldGroup>
                    </form>

                    <SocialAuthButtons />
                </CardContent>
            </Card>
        </div>
    );
};

export default SignInForm;
