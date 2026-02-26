'use client';

import { useEffect } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';

export default function FlashDealInput() {
    const { control, setValue } = useFormContext();

    const isFlashDeal = useWatch({
        control,
        name: 'flashDeal',
    });

    const { field: flashField, fieldState: flashState } = useController({
        name: 'flashDeal',
        control,
        defaultValue: false,
    });

    const { field: expireField, fieldState: expireState } = useController({
        name: 'flashDealExpireHours',
        control,
        defaultValue: 0,
    });

    useEffect(() => {
        if (!isFlashDeal) {
            setValue('flashDealExpireHours', 0, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [isFlashDeal, setValue]);

    return (
        <div className="space-y-4">
            <Field data-invalid={flashState.invalid} orientation="horizontal">
                <Checkbox
                    checked={!!flashField.value}
                    onCheckedChange={flashField.onChange}
                    aria-invalid={flashState.invalid}
                />
                <FieldLabel className="text-gray-700">Flash Deal</FieldLabel>

                {flashState.invalid && <FieldError errors={[flashState.error]} />}
            </Field>

            <Field data-invalid={expireState.invalid} className="gap-2">
                <FieldLabel className="text-gray-700">Time (hours)</FieldLabel>

                <Input
                    {...expireField}
                    type="number"
                    min={1}
                    step={1}
                    disabled={!isFlashDeal}
                    value={expireField.value || ''}
                    onChange={(e) => expireField.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    placeholder="24"
                    aria-invalid={expireState.invalid}
                />

                {expireState.invalid && <FieldError errors={[expireState.error]} />}
            </Field>
        </div>
    );
}
