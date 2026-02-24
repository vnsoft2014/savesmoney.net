'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';

type DealType = {
    _id: string;
    name: string;
};

export default function DealTypeSelect() {
    const { control } = useFormContext();
    const [dealTypes, setDealTypes] = useState<DealType[]>([]);
    const [loading, setLoading] = useState(false);

    const { field, fieldState } = useController({
        name: 'dealType',
        control,
        rules: {
            required: 'Deal type is required',
        },
    });

    useEffect(() => {
        const fetchDealTypes = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/common/deal-type/all', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });

                const json = await res.json();
                setDealTypes(json.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDealTypes();
    }, []);

    const options = dealTypes.map((d) => ({
        value: d._id,
        label: d.name,
    }));

    const selectedOptions = options.filter((opt) => field.value?.includes(opt.value));

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel className="text-gray-700">
                Deal Type <span className="text-red-500">*</span>
            </FieldLabel>

            <Select
                {...field}
                isMulti
                isLoading={loading}
                isDisabled={loading}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                placeholder="Select Deal Type"
                options={options}
                value={selectedOptions}
                onChange={(selected) => field.onChange(selected.map((x) => x.value))}
                onBlur={field.onBlur}
                className="react-select-container"
                classNamePrefix="react-select"
                aria-invalid={fieldState.invalid}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        borderColor: fieldState.invalid ? '#ef4444' : state.isFocused ? '#3b82f6' : '#d1d5db',
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: '#3b82f6',
                        },
                    }),
                }}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
