import { FormDescription, FormField, FormItem, FormLabel } from '@/shared/shadecn/ui/form';
import { Switch } from '@/shared/shadecn/ui/switch';
import { useFormContext } from 'react-hook-form';

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FLAGS.map((f) => (
                <FormField
                    key={f.name}
                    control={control}
                    name={f.name as any}
                    render={({ field }) => (
                        <FormItem className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between">
                                <FormLabel>{f.label}</FormLabel>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </div>
                            <FormDescription>{f.desc}</FormDescription>
                        </FormItem>
                    )}
                />
            ))}
        </div>
    );
}
