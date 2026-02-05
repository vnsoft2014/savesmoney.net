'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { getSettings, updateSettings } from '@/services/admin/settings';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { settingsDefault } from '@/utils/settings';
import { SettingsForm as SettingsFormType, settingsSchema } from './schemas';

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    const form = useForm<SettingsFormType>({
        resolver: zodResolver(settingsSchema),
        defaultValues: settingsDefault,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await getSettings();
                if (settings) {
                    form.reset({
                        websiteTitle: settings.websiteTitle || '',
                        websiteDescription: settings.websiteDescription || '',
                        holidayDealsLabel: settings.holidayDealsLabel || '',
                        seasonalDealsLabel: settings.seasonalDealsLabel || '',
                        adminEmail: settings.adminEmail || '',
                        socialLinks: {
                            facebookPage: settings.socialLinks?.facebookPage || '',
                            facebookGroup: settings.socialLinks?.facebookGroup || '',
                            x: settings.socialLinks?.x || '',
                            instagram: settings.socialLinks?.instagram || '',
                            linkedin: settings.socialLinks?.linkedin || '',
                        },
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, [form]);

    const onSubmit = async (values: SettingsFormType) => {
        setSaving(true);

        const formData = new FormData();
        formData.append('websiteTitle', values.websiteTitle);
        formData.append('websiteDescription', values.websiteDescription);
        formData.append('holidayDealsLabel', values.holidayDealsLabel || '');
        formData.append('seasonalDealsLabel', values.seasonalDealsLabel || '');
        formData.append('adminEmail', values.adminEmail);

        Object.entries(values.socialLinks).forEach(([key, value]) => {
            formData.append(`socialLinks[${key}]`, value || '');
        });

        if (logoFile) formData.append('logo', logoFile);
        if (faviconFile) formData.append('favicon', faviconFile);

        const result = await updateSettings(formData);

        result.success ? toast.success(result.message) : toast.error(result.message);
        setSaving(false);
    };

    if (loading) return <Loading />;

    return (
        <div className="max-w-2xl mx-auto bg-white p-6">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Website Info</h2>

                        <FormField
                            control={form.control}
                            name="websiteTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="websiteDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    {/* Menu */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Menu</h2>

                        <FormField
                            control={form.control}
                            name="holidayDealsLabel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Holiday Deals Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seasonalDealsLabel"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Seasonal Deals Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </section>

                    {/* Admin */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Admin Info</h2>

                        <FormField
                            control={form.control}
                            name="adminEmail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </section>

                    {/* Social Links */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4">Social Links</h2>

                        {(Object.keys(form.watch('socialLinks')) as Array<keyof SettingsFormType['socialLinks']>).map(
                            (key) => (
                                <FormField
                                    key={key}
                                    control={form.control}
                                    name={`socialLinks.${key}`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{key}</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="url" placeholder={`Enter ${key} URL`} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            ),
                        )}
                    </section>

                    <div className="flex justify-end gap-3 pt-6 border-t">
                        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            Save changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
