'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import DealAlertSchema from '../../../shared/seo/DealAlertSchema';

import { useAuth } from '@/hooks/useAuth';
import { addDealAlert } from '@/services/dealAlert.service';
import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { Loader2 } from 'lucide-react';
import { DealAlertForm as DealAlertFormType, dealAlertSchema } from './schemas/DealAlert.schema';

const CHANNELS = ['email'] as const;

const DealAlert = () => {
    const { isSignin, user } = useAuth();

    const {
        control,
        handleSubmit,
        reset,
        formState: { isSubmitting },
    } = useForm<DealAlertFormType>({
        resolver: zodResolver(dealAlertSchema),
        defaultValues: {
            keywords: '',
            channel: 'email',
            name: user?.name ?? '',
            email: user?.email ?? '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: DealAlertFormType) => {
        const payload = {
            ...values,
            keywords: values.keywords.split(',').map((k) => k.trim()),
            user: isSignin ? user!._id : null,
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

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <Controller
                                name="keywords"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="keywords">Keywords</FieldLabel>
                                        <Input id="keywords" placeholder="keywords for an alert" {...field} />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="channel"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel>Channel</FieldLabel>

                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {CHANNELS.map((ch) => (
                                                    <SelectItem key={ch} value={ch}>
                                                        {ch.toUpperCase()}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>

                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="name"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Name</FieldLabel>
                                        <Input
                                            {...field}
                                            id="name"
                                            readOnly={isSignin}
                                            className={isSignin ? 'bg-gray-100 cursor-not-allowed' : ''}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="email"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="email">Email</FieldLabel>
                                        <Input
                                            {...field}
                                            id="email"
                                            type="email"
                                            readOnly={isSignin}
                                            className={isSignin ? 'bg-gray-100 cursor-not-allowed' : ''}
                                        />
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />

                            <Button type="submit" disabled={isSubmitting} className="min-w-20">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DealAlert;
