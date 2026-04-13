'use client';

import { updateProfile } from '@/services';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { MESSAGES } from '@/config/messages';
import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { User } from '@/types';
import { Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ProfileForm as ProfileFormType, profileSchema } from './schemas/Profile.schema';

const roleColorMap: Record<string, string> = {
    user: 'bg-gray-100 text-gray-700',
    contributor: 'bg-blue-100 text-blue-700',
    admin: 'bg-red-100 text-red-700',
};

interface Props {
    user: User;
}

const UserProfile = ({ user }: Props) => {
    const { data: session, update } = useSession();

    const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

    const {
        control,
        handleSubmit,
        formState: { isSubmitting },
    } = useForm<ProfileFormType>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            avatar: null,
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: ProfileFormType) => {
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

        const updatedUser = {
            ...session?.user,
            ...data.finalData,
        };

        await update(updatedUser);

        toast.success(data.message);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="min-h-[90vh] flex items-center px-3 py-6">
                <div className="max-w-3xl w-full mx-auto bg-white p-8 border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-4 md:gap-6 mb-8">
                        <div>
                            <Controller
                                name="avatar"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <div className="relative">
                                            <Image
                                                src={avatarPreview || '/avatar.png'}
                                                alt="Avatar"
                                                width={200}
                                                height={200}
                                                className="w-50 h-50 rounded-full object-cover border"
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

                                                        const url = URL.createObjectURL(file);

                                                        setAvatarPreview((prev) => {
                                                            if (prev?.startsWith('blob:')) {
                                                                URL.revokeObjectURL(prev);
                                                            }
                                                            return url;
                                                        });
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        <div className="text-center text-xs text-muted-foreground">
                                            {MESSAGES.IMAGE.REQUIREMENTS_500}
                                        </div>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                        </div>

                        <div>
                            <h1 className="mb-0 text-2xl font-bold text-gray-800">{user?.name}</h1>
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

                    <div className="space-y-4">
                        <Controller
                            name="name"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="full-name" className="text-gray-700">
                                        Full name
                                    </FieldLabel>
                                    <Input {...field} id="full-name" className="h-12 text-sm" />
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
                                    <Input {...field} id="email" className="h-12 text-sm" disabled />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </Field>
                            )}
                        />

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="min-w-28 bg-indigo-600 hover:bg-indigo-700 text-[13px]"
                        >
                            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Update Profile'}
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default UserProfile;
