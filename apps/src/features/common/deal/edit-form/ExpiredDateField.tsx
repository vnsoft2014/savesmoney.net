'use client';

import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { toDateInputValue } from '@/utils/utils';

export default function ExpiredDateField() {
    const {
        control,
        watch,
        getValues,
        setValue,
        formState: { errors },
    } = useFormContext();

    const [expireAt, coupon, clearance] = useWatch({
        control,
        name: ['disableExpireAt', 'coupon', 'clearance'],
    });

    const disableExpireAt = expireAt || coupon || clearance;
    const disableCheckbox = coupon || clearance;

    useEffect(() => {
        if (disableExpireAt) {
            setValue('expiredDate', null);
        }
    }, [disableExpireAt, setValue]);

    return (
        <>
            <FormField
                control={control}
                name="expiredDate"
                rules={{
                    validate: (value) => (getValues('disableExpireAt') || value ? true : 'Expiry date is required'),
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Expiry Date <span className="text-red-500">*</span>
                        </FormLabel>

                        <Input
                            type="date"
                            value={toDateInputValue(field.value ?? '')}
                            onChange={field.onChange}
                            disabled={disableExpireAt}
                            className={errors.expiredDate ? 'border-red-500' : ''}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="disableExpireAt"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-2 mt-2">
                        <FormLabel className="mb-0">Disable Expiry</FormLabel>

                        <Checkbox
                            className="mb-0"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={disableCheckbox}
                        />
                    </FormItem>
                )}
            />
        </>
    );
}
