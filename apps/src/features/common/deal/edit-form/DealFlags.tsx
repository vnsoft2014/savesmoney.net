'use client';

import { Field, FieldLabel } from '@/shared/shadecn/ui/field';
import { Switch } from '@/shared/shadecn/ui/switch';
import { useController, useFormContext } from 'react-hook-form';

type FlagProps = {
    name: string;
    label: string;
    desc: string;
    control: any;
};

function FlagSwitch({ name, label, desc, control }: FlagProps) {
    const { field, fieldState } = useController({
        name,
        control,
        defaultValue: false,
    });

    return (
        <Field data-invalid={fieldState.invalid} className="border rounded-lg p-4 bg-gray-50 gap-2">
            <div className="flex justify-between items-center">
                <FieldLabel className="text-gray-700">{label}</FieldLabel>

                <Switch checked={!!field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid} />
            </div>

            <p className="text-sm text-muted-foreground">{desc}</p>
        </Field>
    );
}

const FLAGS = [
    { name: 'hotTrend', label: 'Hot Trend', desc: 'Trending deal' },
    { name: 'holidayDeals', label: 'Holiday Deals', desc: 'Holiday campaign' },
    { name: 'seasonalDeals', label: 'Seasonal Deals', desc: 'Seasonal campaign' },
    { name: 'coupon', label: 'Coupon', desc: 'Has coupon' },
    { name: 'clearance', label: 'Clearance', desc: 'Clearance sale' },
];

export default function DealFlags() {
    const { control } = useFormContext();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLAGS.map((f) => (
                <FlagSwitch key={f.name} {...f} control={control} />
            ))}
        </div>
    );
}
