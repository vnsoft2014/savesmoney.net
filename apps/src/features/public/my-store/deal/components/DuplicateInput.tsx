'use client';

import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { useController, useFormContext } from 'react-hook-form';

type Props = {
    name: 'shortDescription' | 'purchaseLink';
    label: string;
};

export default function DuplicateInput({ name, label }: Props) {
    const { control } = useFormContext();

    const { field, fieldState } = useController({
        name,
        control,
    });

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel className="text-gray-700">
                {label} <span className="text-red-500">*</span>
            </FieldLabel>

            <Input {...field} aria-invalid={fieldState.invalid} />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
