'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';

import { MESSAGES } from '@/config/messages';
import { Store } from '@/types';
import { EditStoreForm as EditStoreFormType, editStoreSchema } from '../schemas';
import { updateStore } from '../services';

export default function EditStoreForm({ store }: { store: Store }) {
    const router = useRouter();
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(store.thumbnail || null);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<EditStoreFormType>({
        resolver: zodResolver(editStoreSchema),
        defaultValues: {
            name: store.name,
            slug: store.slug,
            thumbnail: undefined,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: EditStoreFormType) => {
        const fd = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) fd.append(key, value);
            else if (value) fd.append(key, value as string);
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

                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-3">
                    <Controller
                        name="thumbnail"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel className="text-gray-700">Thumbnail</FieldLabel>

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
                                                if (file) {
                                                    field.onChange(file);

                                                    const url = URL.createObjectURL(file);

                                                    setThumbnailPreview((prev) => {
                                                        if (prev?.startsWith('blob:')) {
                                                            URL.revokeObjectURL(prev);
                                                        }
                                                        return url;
                                                    });
                                                }
                                            }}
                                        />
                                    </label>
                                </div>

                                <p className="text-xs text-muted-foreground">{MESSAGES.IMAGE.REQUIREMENTS_500}</p>

                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel htmlFor="name" className="text-gray-700">
                                    Name
                                </FieldLabel>
                                <Input {...field} id="name" aria-invalid={fieldState.invalid} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller
                        name="slug"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid} className="gap-2">
                                <FieldLabel htmlFor="slug" className="text-gray-700">
                                    Slug
                                </FieldLabel>
                                <Input {...field} id="slug" aria-invalid={fieldState.invalid} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
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
            </div>
        </div>
    );
}
