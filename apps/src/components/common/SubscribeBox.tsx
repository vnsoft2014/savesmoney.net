'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Mail } from 'lucide-react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAuth } from '@/hooks/useAuth';
import { subscribeDeal } from '@/services';
import { Button } from '@/shared/shadecn/ui/button';
import { Field, FieldError } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { toast } from 'react-toastify';

const formSchema = z.object({
    email: z.string().min(1, 'Please enter your email').email('Invalid email address'),
});

type FormValues = z.infer<typeof formSchema>;

const SubscribeBox = () => {
    const { user, isSignin } = useAuth();
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, reset } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values: FormValues) => {
        setLoading(true);

        const data = await subscribeDeal(
            {
                name: 'Guest',
                ...values,
            },
            user?._id,
            isSignin,
            'subscribe-box',
        );

        
        if (data.success) {
            toast.success("You're on the list!");
        } else {
            toast.error(data.message || 'Subscribe failed!')
        }

        reset();
        
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex items-start gap-2 bg-white px-3 py-2">
            <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid} className="flex-1">
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input {...field} type="email" placeholder="Email..." className="h-10 pl-10 text-sm" />
                        </div>

                        {fieldState.invalid && <FieldError className="text-xs mt-1" errors={[fieldState.error]} />}
                    </Field>
                )}
            />

            <Button type="submit" size="sm" disabled={loading} className="h-10 text-sm bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
            </Button>
        </form>
    );
};

export default SubscribeBox;
