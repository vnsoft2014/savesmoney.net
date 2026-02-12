import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { useFormContext } from 'react-hook-form';

export default function CouponCodeInput() {
    const { control } = useFormContext();

    return (
        <FormField
            control={control}
            name="couponCode"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <Input value={field.value ?? ''} onChange={(e) => field.onChange(e.target.value)} />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
