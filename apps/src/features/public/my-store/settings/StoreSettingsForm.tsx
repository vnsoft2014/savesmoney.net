'use client';

import { getUserStore, updateMyStoreSettings } from '@/services/user-store';
import { Loading } from '@/shared/components/common';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { UserStore } from '@/shared/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

const formSchema = z.object({
    name: z.string().min(3, 'Store name must be at least 3 characters'),
    website: z
        .string()
        .trim()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                try {
                    new URL(val);
                    return true;
                } catch {
                    return false;
                }
            },
            { message: 'Invalid website URL' },
        ),
    description: z.string().optional(),
    logo: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StoreSettingsForm() {
    const router = useRouter();

    const [store, setStore] = useState<UserStore>();
    const [loading, setLoading] = useState(true);

    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: store?.name || '',
            website: store?.website || '',
            description: store?.description || '',
            logo: store?.logo || '',
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: FormValues) => {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('website', values.website || '');
        formData.append('description', values.description || '');

        if (values.logo?.[0]) {
            formData.append('logo', values.logo[0]);
        }

        const res = await updateMyStoreSettings(formData);

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

            if (res.success) {
                const data = res.data;
                setStore(data);

                setPreview(data?.logo || null);

                form.reset({
                    name: data?.name || '',
                    website: data?.website || '',
                    description: data?.description || '',
                    logo: undefined,
                });
            } else {
                toast.error(res.message || 'Loading failed');
            }
            setLoading(false);
        };

        fetchStore();
    }, [form]);

    if (loading)
        return (
            <div className="min-h-screen flex justify-between items-center">
                <Loading />
            </div>
        );

    return (
        <Card className="shadow-xs bg-white">
            <CardContent className="p-4 lg:p-10 space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">Store Settings</h1>
                    <p className="text-sm text-gray-500">Manage your store profile and information.</p>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem className="flex flex-col items-center space-y-4">
                                    <FormLabel>Store Logo</FormLabel>
                                    <FormControl>
                                        <label className="cursor-pointer inline-block">
                                            <div className="w-28 h-28 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center hover:border-indigo-500 transition">
                                                {preview ? (
                                                    <Image
                                                        src={preview}
                                                        alt="Preview"
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
                                                    field.onChange(e.target.files);
                                                    if (file) {
                                                        setPreview(URL.createObjectURL(file));
                                                    }
                                                }}
                                            />
                                        </label>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-6!">
                            <h2 className="text-lg font-semibold">General Information</h2>

                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Store Name</FormLabel>
                                        <FormControl>
                                            <Input className="rounded-xl" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="website"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Website</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="rounded-xl"
                                                placeholder="https://example.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea className="min-h-30" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting} className="min-w-35">
                                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
