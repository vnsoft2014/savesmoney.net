'use client';

import { updateProfile } from '@/services/common/user';
import { UserData } from '@/types';
import { setUserData } from '@/utils/UserDataSlice';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { Button } from '@/shared/shadecn/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { Loader2 } from 'lucide-react';
import { ProfileForm as ProfileFormType, profileSchema } from './schemas/Profile.schema';

const roleColorMap: Record<string, string> = {
    user: 'bg-gray-100 text-gray-700',
    contributor: 'bg-blue-100 text-blue-700',
    admin: 'bg-red-100 text-red-700',
};

interface Props {
    user: UserData;
}

const UserProfile = ({ user }: Props) => {
    const dispatch = useDispatch();
    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

    const form = useForm<ProfileFormType>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            avatar: null,
        },
    });

    const {
        handleSubmit,
        formState: { isSubmitting },
    } = form;

    const onSubmit = async (values: ProfileFormType) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name.trim());
            if (values.avatar) {
                formData.append('avatar', values.avatar);
            }

            const data = await updateProfile(formData);

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            const oldUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...oldUser, ...data.finalData };

            localStorage.setItem('user', JSON.stringify(updatedUser));
            dispatch(setUserData(updatedUser));

            toast.success(data.message);
        } catch (err: any) {
            toast.error(err?.message || 'Update failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow p-8">
                        <div className="flex items-center gap-6 mb-8">
                            <FormField
                                control={form.control}
                                name="avatar"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="relative">
                                            <img
                                                src={avatarPreview || 'avatar.png'}
                                                alt="Avatar"
                                                className="w-24 h-24 rounded-full object-cover border"
                                            />

                                            <label className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded cursor-pointer">
                                                Change
                                                <input
                                                    type="file"
                                                    hidden
                                                    accept="image/*"
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
                                        </div>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div>
                                <h1 className="mb-0! text-2xl! font-bold text-gray-800">{user?.name}</h1>
                                <p className="text-sm text-gray-500">{user?.email}</p>

                                {user?.role && (
                                    <span
                                        className={`inline-block px-3 py-1 rounded-full text-xs capitalize font-medium ${roleColorMap[user.role]}`}
                                    >
                                        {user.role}
                                    </span>
                                )}

                                {user?.isBlocked && (
                                    <span className="inline-block mt-2 ml-2 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                        Blocked
                                    </span>
                                )}
                            </div>
                        </div>

                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full name</FormLabel>
                                    <FormControl>
                                        <Input className="h-12 text-sm" {...field} />
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
                                        <Input className="h-12 text-sm" {...field} disabled />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-[13px]"
                        >
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Update Profile'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default UserProfile;
