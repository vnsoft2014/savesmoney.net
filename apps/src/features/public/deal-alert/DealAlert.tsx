'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { RootState } from '@/store/store';
import { User } from '@/types';
import DealAlertSchema from '../../../shared/seo/DealAlertSchema';

import { addDealAlert } from '@/services/common/deal-alert';
import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { Loader2 } from 'lucide-react';
import { DealAlertForm as DealAlertFormType, dealAlertSchema } from './schemas/DealAlert.schema';

const CHANNELS = ['email'] as const;

const DealAlert = () => {
    const user = useSelector((state: RootState) => state.user.userData) as User | null;

    const token = Cookies.get('token');
    const isSignin = !!(token && user);

    const form = useForm<DealAlertFormType>({
        resolver: zodResolver(dealAlertSchema),
        defaultValues: {
            keywords: '',
            channel: 'email',
            name: user?.name ?? '',
            email: user?.email ?? '',
        },
    });

    const { handleSubmit, formState, reset } = form;
    const { isSubmitting } = formState;

    const onSubmit = async (values: DealAlertFormType) => {
        const payload = {
            ...values,
            keywords: values.keywords.split(',').map((k) => k.trim()),
            user: isSignin ? user?._id : null,
        };

        const res = await addDealAlert(payload);

        if (res.success) {
            toast.success(res.message);

            reset({
                keywords: '',
                channel: 'email',
                name: user?.name ?? '',
                email: user?.email ?? '',
            });
        } else {
            toast.error(res.message);
        }
    };

    return (
        <>
            <DealAlertSchema />

            <div className="min-h-screen bg-gray-50 px-4 py-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h1 className="text-xl font-bold text-gray-800">Deal Alert 🔔</h1>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-md">
                        <h2 className="mb-6 text-lg font-bold text-gray-800">Add your Alert</h2>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="keywords"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keywords</FormLabel>
                                            <FormControl>
                                                <Input placeholder="keywords for an alert" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="channel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Channel</FormLabel>
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {CHANNELS.map((ch) => (
                                                        <SelectItem key={ch} value={ch}>
                                                            {ch.toUpperCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    readOnly={isSignin}
                                                    className={isSignin ? 'bg-gray-100 cursor-not-allowed' : ''}
                                                />
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
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    {...field}
                                                    readOnly={isSignin}
                                                    className={isSignin ? 'bg-gray-100 cursor-not-allowed' : ''}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" disabled={isSubmitting} className="min-w-20">
                                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DealAlert;
