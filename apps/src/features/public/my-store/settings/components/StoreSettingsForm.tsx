'use client';

import { MESSAGES } from '@/constants/messages';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditUserStoreForm as EditUserStoreFormType, editUserStoreSchema } from '../../schemas/StoreForm.schema';
import { getUserStore, updateMyStoreSettings } from '../../services';

export default function StoreSettingsForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<EditUserStoreFormType>({
        resolver: zodResolver(editUserStoreSchema),
        defaultValues: {
            name: '',
            website: '',
            description: '',
            logo: undefined,
        },
    });

    const {
        handleSubmit,
        control,
        reset,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: EditUserStoreFormType) => {
        const fd = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) fd.append(key, value);
            else if (value) fd.append(key, value as string);
        });

        const res = await updateMyStoreSettings(fd);

        if (res.success) {
            toast.success('Store updated successfully');
            router.push('/my-store');
        } else {
            toast.error(res.message || 'Update failed');
        }
    };

    useEffect(() => {
        const fetchStore = async () => {
            setLoading(true);

            const res = await getUserStore();
            const store = res.data;

            setLogoPreview(store?.logo || null);

            reset({
                name: store?.name || '',
                website: store?.website || '',
                description: store?.description || '',
                logo: undefined,
            });

            setLoading(false);
        };

        fetchStore();
    }, [reset]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <Card className="shadow-xs bg-white">
            <CardContent className="p-4 lg:p-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">Store Settings</h1>
                    <p className="text-sm text-gray-500">Manage your store profile and information.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FieldGroup>
                        <Controller
                            name="logo"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel className="justify-center text-gray-700">
                                        Store Logo <span className="text-red-500">*</span>
                                    </FieldLabel>

                                    <label className="flex justify-center cursor-pointer">
                                        <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition">
                                            {logoPreview ? (
                                                <Image
                                                    src={logoPreview}
                                                    alt="LogoPreview"
                                                    width={112}
                                                    height={112}
                                                    className="w-full h-full object-cover rounded-2xl"
                                                />
                                            ) : (
                                                <ImagePlus className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>

                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    field.onChange(file);

                                                    const url = URL.createObjectURL(file);

                                                    setLogoPreview((prev) => {
                                                        if (prev?.startsWith('blob:')) {
                                                            URL.revokeObjectURL(prev);
                                                        }
                                                        return url;
                                                    });
                                                }
                                            }}
                                        />
                                    </label>

                                    <div className="text-center text-xs text-muted-foreground">
                                        {MESSAGES.IMAGE.REQUIREMENTS_500}
                                    </div>

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="store-name" className="text-gray-700">
                                        Store Name <span className="text-red-500">*</span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="store-name"
                                        className="h-12"
                                        aria-invalid={fieldState.invalid}
                                        maxLength={60}
                                    />

                                    <div className="flex justify-between items-center">
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        <div className="ml-auto text-xs text-gray-400">
                                            {field.value?.length || 0}/60
                                        </div>
                                    </div>
                                </Field>
                            )}
                        />

                        <Controller
                            name="website"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="store-website" className="text-gray-700">
                                        Website <span className="text-gray-400 text-sm">(Optional)</span>
                                    </FieldLabel>

                                    <Input
                                        {...field}
                                        id="store-website"
                                        className="h-12"
                                        placeholder="https://example.com"
                                        aria-invalid={fieldState.invalid}
                                    />

                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field className="gap-2" data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="store-description" className="text-gray-700">
                                        Description <span className="text-red-500">*</span>
                                    </FieldLabel>

                                    <Textarea
                                        {...field}
                                        id="store-description"
                                        className="min-h-25 resize-none"
                                        maxLength={300}
                                        aria-invalid={fieldState.invalid}
                                    />

                                    <div className="flex justify-between items-center">
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        <div className="ml-auto text-xs text-gray-400">
                                            {field.value?.length || 0}/300
                                        </div>
                                    </div>
                                </Field>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="min-w-35 font-semibold">
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
