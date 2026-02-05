import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Select from 'react-select';

export default function DealTypeSelect() {
    const { control } = useFormContext();
    const [dealTypes, setDealTypes] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/common/deal-type/all', {
            headers: { Authorization: `Bearer ${Cookies.get('token')}` },
        })
            .then((r) => r.json())
            .then((r) => setDealTypes(r.data || []));
    }, []);

    return (
        <FormField
            control={control}
            name="dealType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Deal Type *</FormLabel>

                    <Select
                        isMulti
                        options={dealTypes.map((d) => ({ value: d._id, label: d.name }))}
                        value={dealTypes
                            .filter((d) => field.value?.includes(d._id))
                            .map((d) => ({ value: d._id, label: d.name }))}
                        onChange={(v) => field.onChange(v.map((x) => x.value))}
                    />

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
