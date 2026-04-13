'use client';

import { useEffect } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { toDateInputValue } from '@/lib/utils';
import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { Label } from '@/shared/shadecn/ui/label';

export default function ExpiredDateField() {
    const { control, setValue, trigger } = useFormContext();

    const [disableExpireAt, coupon, clearance, flashDeal] = useWatch({
        control,
        name: ['disableExpireAt', 'coupon', 'clearance', 'flashDeal'],
    });

    const isDisableExpireAt = disableExpireAt || coupon || clearance;

    const { field: expiredField, fieldState: expiredState } = useController({
        name: 'expiredDate',
        control,
    });

    const { field: disableField } = useController({
        name: 'disableExpireAt',
        control,
    });

    useEffect(() => {
        if (isDisableExpireAt || flashDeal) {
            setValue('expiredDate', '', { shouldDirty: true });
        }
    }, [isDisableExpireAt, flashDeal, setValue]);

    return (
        <>
            <Field data-invalid={expiredState.invalid} className="gap-2">
                <FieldLabel className="text-gray-700">
                    Expiry Date <span className="text-red-500">*</span>
                </FieldLabel>

                <Input
                    {...expiredField}
                    type="date"
                    value={toDateInputValue(expiredField.value ?? null)}
                    onChange={expiredField.onChange}
                    disabled={isDisableExpireAt || flashDeal}
                    aria-invalid={expiredState.invalid}
                    className={expiredState.invalid ? 'border-red-500' : ''}
                />

                {expiredState.invalid && <FieldError errors={[expiredState.error]} />}
            </Field>

            <Field orientation="horizontal">
                <Label>Disable Expiry</Label>

                <Checkbox
                    checked={disableField.value}
                    onCheckedChange={disableField.onChange}
                    disabled={coupon || clearance || flashDeal}
                />
            </Field>
        </>
    );
}
