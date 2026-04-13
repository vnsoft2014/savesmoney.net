'use client';

import { MESSAGES } from '@/config/messages';
import { ALLOWED_IMAGE_TYPES } from '@/config/upload';
import { Button } from '@/shared/shadecn/ui/button';
import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditUserForm as EditUserFormType, editUserSchema } from '../schemas';
import { updateUser } from '../services';

interface Props {
    user: User;
}

export default function EditUserForm({ user }: Props) {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

    const {
        control,
        handleSubmit,
        watch,
        clearErrors,
        formState: { isSubmitting },
    } = useForm<EditUserFormType>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            ...user,
            password: '',
            avatar: null,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: EditUserFormType) => {
        try {
            const fd = new FormData();

            Object.entries(values).forEach(([key, value]) => {
                if (value instanceof File) {
                    fd.append(key, value);
                } else if (typeof value === 'string') {
                    fd.append(key, value);
                } else if (typeof value === 'boolean') {
                    fd.append(key, String(value));
                }
            });

            const res = await updateUser(user._id, fd);

            if (res.success) {
                toast.success('User updated successfully');
                router.push('/dashboard');
            } else {
                toast.error(res.message || 'Update failed');
            }
        } catch {}
    };

    const isBlocked = watch('isBlocked');

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" type="button" onClick={() => router.back()}>
                            <ArrowLeft />
                        </Button>
                        <h1 className="text-2xl font-bold">Edit User</h1>
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        <Save className="mr-2 h-4 w-4" />
                        Save changes
                    </Button>
                </div>

                <Controller
                    name="avatar"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">Avatar</FieldLabel>

                            <div className="flex items-center gap-4">
                                <img
                                    src={avatarPreview || '/avatar.png'}
                                    alt="Avatar preview"
                                    className="w-24 h-24 rounded-full border object-cover"
                                />

                                <div>
                                    <label className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded cursor-pointer hover:bg-green-700">
                                        Change
                                        <input
                                            type="file"
                                            hidden
                                            accept={ALLOWED_IMAGE_TYPES.join(',')}
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

                                    <p className="mt-1 text-xs text-muted-foreground">
                                        {MESSAGES.IMAGE.REQUIREMENTS_500}
                                    </p>
                                </div>
                            </div>

                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">Name</FieldLabel>
                            <Input {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">Email</FieldLabel>
                            <Input type="email" {...field} />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                        </Field>
                    )}
                />

                <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel className="text-gray-700">New Password</FieldLabel>
                            <div className="relative">
                                <Input type={showPassword ? 'text' : 'password'} {...field} />
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

                <Controller
                    name="isBlocked"
                    control={control}
                    render={({ field }) => (
                        <Field orientation="horizontal">
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            <FieldLabel className="mb-0 text-gray-700">Block this user</FieldLabel>
                        </Field>
                    )}
                />

                {isBlocked && (
                    <Controller
                        name="blockReason"
                        control={control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className="text-gray-700">Block reason</FieldLabel>
                                <Textarea {...field} />
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                )}
            </form>
        </div>
    );
}
