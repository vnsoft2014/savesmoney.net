'use client';

import { ALLOWED_IMAGE_TYPES } from '@/constants/upload';
import { Button } from '@/shared/shadecn/ui/button';
import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';
import { Textarea } from '@/shared/shadecn/ui/textarea';
import { User } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Eye, EyeOff, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { EditUserForm as EditUserFormType, editUserSchema } from './schemas';
import { updateUser } from './services';

interface Props {
    user: User;
}

export default function EditUserForm({ user }: Props) {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

    const form = useForm<EditUserFormType>({
        resolver: zodResolver(editUserSchema),
        defaultValues: {
            ...user,
            password: '',
            avatar: null,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

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

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => router.back()}>
                                <ArrowLeft />
                            </Button>
                            <h1 className="text-2xl font-bold">Edit User</h1>
                        </div>

                        <Button type="submit" disabled={isSubmitting}>
                            <Save className="mr-2 h-4 w-4" />
                            Save changes
                        </Button>
                    </div>

                    <FormField
                        control={form.control}
                        name="avatar"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Avatar</FormLabel>

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
                                                    form.clearErrors('avatar');

                                                    const url = URL.createObjectURL(file);
                                                    setAvatarPreview((prev) => {
                                                        if (prev?.startsWith('blob:')) URL.revokeObjectURL(prev);
                                                        return url;
                                                    });
                                                }}
                                            />
                                        </label>

                                        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WEBP • Max 500KB</p>
                                    </div>
                                </div>

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
                        name="email"
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

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="role"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="user">User</SelectItem>
                                        <SelectItem value="contributor">Contributor</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isBlocked"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="mb-0">Block this user</FormLabel>
                            </FormItem>
                        )}
                    />

                    {form.watch('isBlocked') && (
                        <FormField
                            control={form.control}
                            name="blockReason"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Block reason</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}
                </form>
            </Form>
        </div>
    );
}
