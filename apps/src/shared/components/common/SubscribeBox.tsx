'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAuth } from '@/hooks/useAuth';
import { subscribeDeal } from '@/services/common/subscribe';
import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { toast } from 'react-toastify';

const formSchema = z.object({
    email: z.string().min(1, 'Please enter your email').email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const SubscribeBox = () => {
    const { user, isSignin } = useAuth();

    const [loading, setLoading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);
        try {
            const data = await subscribeDeal(
                {
                    name: 'Guest',
                    ...values,
                },
                user?._id,
                isSignin,
                'subscribe-box',
            );

            if (data.subscribed) {
                toast.success("You're on the list!");
            }

            form.reset();
        } catch (err: any) {
            toast.error(err.message || 'Subscribe failed!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2 bg-white px-3 py-2">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                    <Input
                                        {...field}
                                        type="email"
                                        placeholder="Email..."
                                        className="h-10 pl-10 text-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs mt-1" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    size="sm"
                    disabled={loading}
                    className="h-10 text-sm bg-blue-600 hover:bg-blue-700"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                </Button>
            </form>
        </Form>
    );
};

export default SubscribeBox;
