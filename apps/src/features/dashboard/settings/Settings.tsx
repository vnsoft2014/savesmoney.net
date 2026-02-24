'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getSettings } from '@/services';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { settingsDefault } from '@/utils/settings';

import { SettingsForm as SettingsFormType, settingsSchema } from '../schemas';
import { updateSettings } from '../services';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { isSubmitting },
    } = useForm<SettingsFormType>({
        resolver: zodResolver(settingsSchema),
        defaultValues: settingsDefault,
        mode: 'onChange',
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const settings = await getSettings();

            setLogoPreview(settings.logo);
            setFaviconPreview(settings.favicon);

            reset({
                logo: undefined,
                favicon: undefined,
                websiteTitle: settings.websiteTitle || '',
                websiteDescription: settings.websiteDescription || '',
                holidayDealsLabel: settings.holidayDealsLabel || '',
                seasonalDealsLabel: settings.seasonalDealsLabel || '',
                adminEmail: settings.adminEmail || '',
                footerQuote: settings.footerQuote || '',
                footerQuoteAuthor: settings.footerQuoteAuthor || '',
                socialLinks: {
                    facebookPage: settings.socialLinks?.facebookPage || '',
                    facebookGroup: settings.socialLinks?.facebookGroup || '',
                    x: settings.socialLinks?.x || '',
                    instagram: settings.socialLinks?.instagram || '',
                    linkedin: settings.socialLinks?.linkedin || '',
                },
            });

            setLoading(false);
        };

        fetchSettings();
    }, [reset]);

    const onSubmit = async (values: SettingsFormType) => {
        setSaving(true);

        const formData = new FormData();

        formData.append('websiteTitle', values.websiteTitle);
        formData.append('websiteDescription', values.websiteDescription);
        formData.append('holidayDealsLabel', values.holidayDealsLabel || '');
        formData.append('seasonalDealsLabel', values.seasonalDealsLabel || '');
        formData.append('adminEmail', values.adminEmail);
        formData.append('footerQuote', values.footerQuote || '');
        formData.append('footerQuoteAuthor', values.footerQuoteAuthor || '');

        Object.entries(values.socialLinks).forEach(([key, value]) => {
            formData.append(`socialLinks[${key}]`, value || '');
        });

        if (values.logo?.[0]) {
            formData.append('logo', values.logo[0]);
        }

        if (values.favicon?.[0]) {
            formData.append('favicon', values.favicon[0]);
        }

        const result = await updateSettings(formData);

        result.success ? toast.success(result.message) : toast.error(result.message);

        setSaving(false);
    };

    if (loading) return <Loading />;

    const socialLinks = watch('socialLinks');

    return (
        <div className="max-w-3xl mx-auto bg-white p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <section className="space-y-6">
                    <h2 className="text-xl font-semibold">Branding</h2>

                    <Controller
                        name="logo"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="flex flex-col items-center gap-4">
                                <FieldLabel>Logo</FieldLabel>

                                <label className="cursor-pointer inline-block">
                                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition overflow-hidden">
                                        {logoPreview ? (
                                            <Image
                                                src={logoPreview}
                                                alt="Logo"
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
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

                                            field.onChange(e.target.files);

                                            if (file) {
                                                setLogoPreview((prev) => {
                                                    if (prev?.startsWith('blob:')) {
                                                        URL.revokeObjectURL(prev);
                                                    }
                                                    return URL.createObjectURL(file);
                                                });
                                            }
                                        }}
                                    />
                                </label>

                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="favicon"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="flex flex-col items-center gap-4">
                                <FieldLabel>Favicon</FieldLabel>

                                <label className="cursor-pointer inline-block">
                                    <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition overflow-hidden">
                                        {faviconPreview ? (
                                            <Image
                                                src={faviconPreview}
                                                alt="Favicon"
                                                width={112}
                                                height={112}
                                                className="w-full h-full object-cover"
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

                                            field.onChange(e.target.files);

                                            if (file) {
                                                setFaviconPreview((prev) => {
                                                    if (prev?.startsWith('blob:')) {
                                                        URL.revokeObjectURL(prev);
                                                    }
                                                    return URL.createObjectURL(file);
                                                });
                                            }
                                        }}
                                    />
                                </label>

                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Website Info</h2>

                    <Controller
                        name="websiteTitle"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Website Title</FieldLabel>
                                <Input {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="websiteDescription"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Website Description</FieldLabel>
                                <Textarea rows={3} {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Admin Info</h2>

                    <Controller
                        name="adminEmail"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel>Email</FieldLabel>
                                <Input type="email" {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                </section>

                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">Social Links</h2>

                    {(Object.keys(socialLinks) as Array<keyof SettingsFormType['socialLinks']>).map((key) => (
                        <Controller
                            key={key}
                            name={`socialLinks.${key}`}
                            control={control}
                            render={({ field }) => (
                                <Field>
                                    <FieldLabel>{key}</FieldLabel>
                                    <Input {...field} type="url" placeholder={`Enter ${key} URL`} />
                                </Field>
                            )}
                        />
                    ))}
                </section>

                <div className="flex justify-end gap-3 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={saving || isSubmitting}>
                        Save changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
