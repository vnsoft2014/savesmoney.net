'use client';

import { MESSAGES } from '@/config/messages';
import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { AddUserForm as AddUserFormType, addUserSchema } from '../schemas';
import { addUser } from '../services';

export default function AddUserForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

    const {
        control,
        handleSubmit,
        clearErrors,
        formState: { isSubmitting },
    } = useForm<AddUserFormType>({
        resolver: zodResolver(addUserSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'user',
            avatar: null,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: AddUserFormType) => {
        const fd = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (value instanceof File) {
                fd.append(key, value);
            } else if (typeof value === 'string') {
                fd.append(key, value);
            }
        });

        const res = await addUser(fd);

        if (res?.success) {
            toast.success(res.message);
            router.push('/dashboard');
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" type="button" onClick={() => router.back()}>
                    <ArrowLeft />
                </Button>
                <h1 className="text-2xl font-bold">Add User</h1>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow space-y-6">
                <Controller
                    name="avatar"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">Avatar</FieldLabel>

                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarPreview || '/avatar.png'}
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
                                            clearErrors('avatar');

                                            setAvatarPreview((prev) => {
                                                if (prev?.startsWith('blob:')) {
                                                    URL.revokeObjectURL(prev);
                                                }
                                                return URL.createObjectURL(file);
                                            });
                                        }}
                                    />
                                </label>
                            </div>

                            <p className="mt-1 text-xs text-muted-foreground">{MESSAGES.IMAGE.REQUIREMENTS_500}</p>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="name" className="text-gray-700">
                                Name
                            </FieldLabel>
                            <Input {...field} id="name" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="email" className="text-gray-700">
                                Email
                            </FieldLabel>
                            <Input type="email" {...field} id="email" aria-invalid={fieldState.invalid} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel id="password" className="text-gray-700">
                                Password
                            </FieldLabel>
                            <div className="relative">
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    {...field}
                                    id="password"
                                    aria-invalid={fieldState.invalid}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="role"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">Role</FieldLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="contributor">Contributor</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <div className="flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>

                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}
