'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/shadecn/ui/card';
import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { SocialAuthButtons } from '../components';
import { SignUpForm as SignUpFormType, signUpSchema } from '../schemas/SignUp.schema';
import { registerMe } from '../services';

const SignUpForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const redirectTo = searchParams.get('redirect') || '/';

    const form = useForm<SignUpFormType>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            agreeTerms: false as unknown as true,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: SignUpFormType) => {
        const res = await registerMe({
            name: values.name,
            email: values.email,
            password: values.password,
        });

        if (!res.success) {
            toast.error(res.message || 'Registration failed');
            return;
        }

        const loginResult = await signIn('credentials', {
            redirect: false,
            email: values.email,
            password: values.password,
        });

        if (loginResult?.error) {
            toast.error('Account created but auto login failed');
            return;
        }

        toast.success('Account created successfully 🎉');

        const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//') ? redirectTo : '/';

        router.push(safeRedirect);
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center px-3 py-6">
            <Card className="w-full max-w-150 p-4 md:p-8 inset-shadow-2xs">
                <CardHeader className="space-y-4 text-center mb-6">
                    <div className="mx-auto p-3 bg-indigo-100 rounded-full w-fit">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                        <CardTitle className="text-2xl md:text-3xl font-bold text-gray-800">Sign Up</CardTitle>
                        <CardDescription className="text-gray-600">Create your SavesMoney account</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Full Name</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input placeholder="John Doe" className="pl-10 h-12" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Email</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input placeholder="your@email.com" className="pl-10 h-12" {...field} />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    className="pl-10 pr-10 h-12"
                                                    placeholder="*********"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
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
                                        <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    className="pl-10 pr-10 h-12"
                                                    placeholder="*********"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? (
                                                        <EyeOff className="h-4 w-4" />
                                                    ) : (
                                                        <Eye className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="agreeTerms"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="flex flex-row items-center space-x-2 space-y-0">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <FormLabel className="mb-0 text-sm font-normal text-gray-600 cursor-pointer">
                                                I agree to the Terms and Conditions
                                            </FormLabel>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full h-12 font-semibold shadow-lg"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Sign Up'}
                            </Button>

                            <div className="text-center text-sm text-gray-600 mt-4">
                                Already have an account?{' '}
                                <Link
                                    href={`/signin?redirect=${encodeURIComponent(redirectTo)}`}
                                    className="text-indigo-600 hover:underline font-semibold"
                                >
                                    Sign In
                                </Link>
                            </div>
                        </form>

                        <SocialAuthButtons />
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default SignUpForm;
