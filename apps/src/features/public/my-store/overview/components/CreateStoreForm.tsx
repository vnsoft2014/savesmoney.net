'use client';

import { createUserStore } from '@/services/user-store';
import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { ImagePlus, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { UserStoreForm as UserStoreFormType, userStoreSchema } from '../../schemas/StoreForm.schema';

export default function CreateStoreForm() {
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm<UserStoreFormType>({
        resolver: zodResolver(userStoreSchema),
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

    const onSubmit = async (values: UserStoreFormType) => {
        if (!preview) {
            toast.error('Store logo is required');
            return;
        }

        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('website', values.website || '');
        formData.append('description', values.description || '');

        if (values.logo?.[0]) {
            formData.append('logo', values.logo[0]);
        }

        const res = await createUserStore(formData);

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
                            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-gray-900">
                                Create Your Store
                            </h1>
                            <p className="text-sm text-gray-500">Set up your store profile to get started.</p>
                        </div>

                        <Form {...form}>
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="logo"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col items-center space-y-4">
                                            <FormLabel>
                                                Store Logo <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <label className="cursor-pointer">
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

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Store Name <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Enter your store name"
                                                    className="rounded-xl"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-400 text-right">
                                                {field.value?.length || 0}/60
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="website"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Website <span className="text-gray-400 text-sm">(Optional)</span>
                                            </FormLabel>
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
                                            <FormLabel>
                                                Description <span className="text-red-500">*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell customers about your store..."
                                                    className="min-h-25"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <div className="text-xs text-gray-400 text-right">
                                                {field.value?.length || 0}/300
                                            </div>
                                            <FormMessage />
                                        </FormItem>
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
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
