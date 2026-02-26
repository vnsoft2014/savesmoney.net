'use client';

import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { useEffect } from 'react';
import { useController, useFormContext, useWatch } from 'react-hook-form';

export default function PriceFields() {
    const { control, getValues, setValue } = useFormContext();

    const originalPrice = useWatch({ control, name: 'originalPrice' });
    const discountPrice = useWatch({ control, name: 'discountPrice' });

    const percent =
        originalPrice && discountPrice ? `${Math.round(((originalPrice - discountPrice) / originalPrice) * 100)}%` : '';

    useEffect(() => {
        setValue('percentageOff', percent, {
            shouldValidate: true,
            shouldDirty: true,
        });
    }, [percent, setValue]);

    const { field: originalField, fieldState: originalState } = useController({
        name: 'originalPrice',
        control,
        rules: {
            required: 'Original price is required',
            min: { value: 0, message: 'Must be greater than 0' },
        },
    });

    const { field: discountField, fieldState: discountState } = useController({
        name: 'discountPrice',
        control,
        rules: {
            validate: (value) => {
                if (!value) return true;
                return value <= getValues('originalPrice') ? true : 'Discount must be less than original price';
            },
        },
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field data-invalid={originalState.invalid}>
                <FieldLabel className="text-gray-700">
                    Original Price <span className="text-red-500">*</span>
                </FieldLabel>

                <Input
                    {...originalField}
                    type="number"
                    placeholder="299"
                    min={0}
                    step={0.01}
                    value={originalField.value || ''}
                    onChange={(e) => originalField.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    aria-invalid={originalState.invalid}
                />

                {originalState.invalid && <FieldError errors={[originalState.error]} />}
            </Field>

            <Field data-invalid={discountState.invalid}>
                <FieldLabel className="text-gray-700">Discount Price</FieldLabel>

                <Input
                    {...discountField}
                    type="number"
                    placeholder="269"
                    min={0}
                    step={0.01}
                    value={discountField.value || ''}
                    onChange={(e) => discountField.onChange(e.target.value === '' ? 0 : Number(e.target.value))}
                    aria-invalid={discountState.invalid}
                />

                {discountState.invalid && <FieldError errors={[discountState.error]} />}
            </Field>

            <Field>
                <FieldLabel className="text-gray-700">Percentage Off</FieldLabel>

                <Input readOnly value={percent} placeholder="Auto-calculated" className="bg-gray-50 text-gray-600" />
            </Field>
        </div>
    );
}
