'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Store } from '@/shared/types';
import { StoreForm as StoreFormType, storeSchema } from './schemas';
import { updateStore } from './services';

export default function EditStoreForm({ store }: { store: Store }) {
    const router = useRouter();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(store.thumbnail || null);

    const form = useForm<StoreFormType>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: store.name,
            slug: store.slug,
            thumbnail: null,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: StoreFormType) => {
        const fd = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) fd.append(key, value);
            else if (value) fd.append(key, value);
        });

        const res = await updateStore(store._id, fd);

        if (res.success) {
            toast.success('Store updated successfully');
            router.push('/dashboard');
        } else {
            toast.error(res.message || 'Update failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
                <div className="flex items-center gap-3 mb-6">
                    <button onClick={() => router.back()}>
                        <ArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold">Edit Store</h1>
                </div>

                <Form {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3">
                        <FormField
                            control={form.control}
                            name="thumbnail"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Thumbnail</FormLabel>

                                    <div className="flex items-center gap-4">
                                        <img
                                            src={thumbnailPreview || '/image.png'}
                                            className="w-24 h-24 rounded-full border object-cover"
                                        />

                                        <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded cursor-pointer hover:bg-green-700">
                                            Change
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (!file) return;

                                                    field.onChange(file);
                                                    form.clearErrors('thumbnail');

                                                    const url = URL.createObjectURL(file);
                                                    setThumbnailPreview((prev) => {
                                                        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
                                                        return url;
                                                    });
                                                }}
                                            />
                                        </label>
                                    </div>

                                    <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP • Max 500KB</p>

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
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="col-span-full flex justify-end gap-3 mt-4">
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Cancel
                            </Button>

                            <Button type="submit" disabled={isSubmitting}>
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
