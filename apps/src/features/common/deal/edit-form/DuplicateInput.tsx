'use client';

import { checkDuplicate } from '@/features/dashboard/services';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';
import { useRef } from 'react';
import { useController, useFormContext } from 'react-hook-form';

type Props = {
    name: 'shortDescription' | 'purchaseLink';
    label: string;
};

export default function DuplicateInput({ name, label }: Props) {
    const { control, setError, clearErrors } = useFormContext();

    const { field, fieldState } = useController({
        name,
        control,
    });

    const timeout = useRef<NodeJS.Timeout | null>(null);
    const requestId = useRef(0);

    const debounceCheck = (value: string) => {
        if (!value) {
            clearErrors(name);
            return;
        }

        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(async () => {
            const currentRequest = ++requestId.current;

            const res = await checkDuplicate(
                name === 'shortDescription' ? value : undefined,
                name === 'purchaseLink' ? value : undefined,
            );

            if (currentRequest !== requestId.current) return;

            if (res?.isDuplicate) {
                setError(name, {
                    type: 'manual',
                    message: `${label} already exists`,
                });
            } else {
                clearErrors(name);
            }
        }, 500);
    };

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel className="text-gray-700">
                {label} <span className="text-red-500">*</span>
            </FieldLabel>

            <Input
                {...field}
                aria-invalid={fieldState.invalid}
                onChange={(e) => {
                    field.onChange(e.target.value);
                    debounceCheck(e.target.value);
                }}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
