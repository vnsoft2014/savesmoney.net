'use client';

import { MESSAGES } from '@/config/messages';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AddUserStoreForm as AddUserStoreFormType, addUserStoreSchema } from '../../schemas/StoreForm.schema';
import { createUserStore } from '../../services';

export default function CreateStoreForm() {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);

    const form = useForm<AddUserStoreFormType>({
        resolver: zodResolver(addUserStoreSchema),
        defaultValues: {
            name: '',
            website: '',
            description: '',
            logo: undefined,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: AddUserStoreFormType) => {
        const fd = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) fd.append(key, value);
            else if (value) fd.append(key, value as string);
        });

        const res = await createUserStore(fd);

        if (res.success) {
            toast.success('Store created successfully');

            window.location.reload();
        } else {
            toast.error(res.message || 'Create failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-xl mx-auto">
                <Card className="shadow-xs bg-white">
                    <CardContent className="p-4 lg:p-10 space-y-8">
                        <div className="text-center space-y-2">
                            <p className="text-left text-sm md:text-[15px] leading-relaxed">
                                <span className="inline md:block">
                                    You can post your deals and earn commission by creating your store.
                                </span>
                                <span className="inline md:block ml-1 md:ml-0">
                                    Creating a store with us is simple and fast!
                                </span>
                            </p>

                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                                Create Your Store
                            </h1>
                            <p className="text-sm text-gray-500">Set up your store profile to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mb-2 space-y-6">
                                <Controller
                                    name="logo"
                                    control={form.control}
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
                                                    className="w-0 p-0 opacity-0"
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

                                            {fieldState.invalid && (
                                                <FieldError className="text-center" errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                <Controller
                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="gap-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="store-name" className="text-gray-700">
                                                Store Name <span className="text-red-500">*</span>
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="store-name"
                                                aria-invalid={fieldState.invalid}
                                                className="h-12"
                                                placeholder="Enter your store name"
                                            />

                                            <div className="flex justify-between items-center">
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                                <div className="ml-auto py-1 text-xs text-gray-400 text-right">
                                                    {field.value?.length || 0}/60
                                                </div>
                                            </div>
                                        </Field>
                                    )}
                                />
                            </div>

                            <div className="space-y-6">
                                {/* <Controller
                                    name="website"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="gap-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="store-website" className="text-gray-700">
                                                Website <span className="text-gray-400 text-sm">(Optional)</span>
                                            </FieldLabel>

                                            <Input
                                                {...field}
                                                id="store-website"
                                                aria-invalid={fieldState.invalid}
                                                className="h-12"
                                                placeholder="https://example.com"
                                            />

                                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                        </Field>
                                    )}
                                /> */}

                                <Controller
                                    name="description"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field className="gap-2" data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="store-description" className="text-gray-700">
                                                Description <span className="text-red-500">*</span>
                                            </FieldLabel>

                                            <Textarea
                                                {...field}
                                                id="store-description"
                                                placeholder="Short description about your store, what kind of items does it focus?"
                                                className="min-h-25 resize-none"
                                                aria-invalid={fieldState.invalid}
                                            />
                                            <div className="flex justify-between items-center">
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}

                                                <div className="ml-auto py-1 text-xs text-gray-400 text-right">
                                                    {field.value?.length || 0}/300
                                                </div>
                                            </div>
                                        </Field>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full text-base font-semibold"
                                >
                                    {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Store
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
