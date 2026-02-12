'use client';

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';

type Store = {
    _id: string;
    name: string;
};

export default function StoreSelect() {
    const { control, formState } = useFormContext();
    const [stores, setStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/common/store/all', {
                    headers: { Authorization: `Bearer ${Cookies.get('token')}` },
                }).then((r) => r.json());

                setStores(res.data || []);
            } finally {
                setLoading(false);
            }
        };

        fetchStores();
    }, []);

    return (
        <FormField
            control={control}
            name="store"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>
                        Deal Store <span className="text-red-500">*</span>
                    </FormLabel>

                    <Select
                        isClearable
                        isLoading={loading}
                        isDisabled={loading}
                        menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
                        menuPosition="fixed"
                        placeholder="Select Deal Store"
                        options={stores.map((s) => ({
                            value: s._id,
                            label: s.name,
                        }))}
                        value={
                            field.value
                                ? {
                                      value: field.value,
                                      label: stores.find((s) => s._id === field.value)?.name ?? field.value,
                                  }
                                : null
                        }
                        onChange={(opt) => field.onChange(opt ? opt.value : '')}
                        styles={{
                            control: (base, state) => ({
                                ...base,
                                borderColor: formState.errors.store
                                    ? '#ef4444'
                                    : state.isFocused
                                      ? '#3b82f6'
                                      : '#d1d5db',
                                boxShadow: 'none',
                                '&:hover': {
                                    borderColor: '#3b82f6',
                                },
                            }),
                        }}
                    />

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
