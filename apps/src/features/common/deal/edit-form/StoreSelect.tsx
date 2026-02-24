'use client';

import Cookies from 'js-cookie';
import { useEffect, useMemo, useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';

type Store = {
    _id: string;
    name: string;
};

export default function StoreSelect() {
    const { control } = useFormContext();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);

    const { field, fieldState } = useController({
        name: 'store',
        control,
        rules: {
            required: 'Store is required',
        },
    });

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);

                const res = await fetch('/api/common/store/all', {
                    headers: {
                        Authorization: `Bearer ${Cookies.get('token')}`,
                    },
                });

                const json = await res.json();
                setStores(json.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    const options = useMemo(
        () =>
            stores.map((s) => ({
                value: s._id,
                label: s.name,
            })),
        [stores],
    );

    const selectedOption = useMemo(() => {
        if (!field.value) return null;

        const store = stores.find((s) => s._id === field.value);
        return store ? { value: store._id, label: store.name } : { value: field.value, label: field.value };
    }, [field.value, stores]);

    return (
        <Field data-invalid={fieldState.invalid} className="gap-2">
            <FieldLabel className="text-gray-700">
                Deal Store <span className="text-red-500">*</span>
            </FieldLabel>

            <Select
                {...field}
                isClearable
                isLoading={loading}
                isDisabled={loading}
                menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                menuPosition="fixed"
                placeholder="Select Deal Store"
                options={options}
                value={selectedOption}
                onChange={(opt) => field.onChange(opt ? opt.value : '')}
                onBlur={field.onBlur}
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
