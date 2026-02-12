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
        getValues,
        setValue,
        formState: { errors },
    } = useFormContext();

    const [disableExpireAt, coupon, clearance, flashDeal] = useWatch({
        control,
        name: ['disableExpireAt', 'coupon', 'clearance', 'flashDeal'],
    });

    const isDisableExpireAt = disableExpireAt || coupon || clearance;

    useEffect(() => {
        if (isDisableExpireAt || flashDeal) {
            setValue('expiredDate', null);
        }
    }, [isDisableExpireAt, setValue]);

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
                            disabled={isDisableExpireAt || flashDeal}
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
                            disabled={coupon || clearance || flashDeal}
                        />
                    </FormItem>
                )}
            />
        </>
    );
}
