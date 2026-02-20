import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

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

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
                control={control}
                name="originalPrice"
                rules={{
                    required: 'Original price is required',
                    min: { value: 0, message: 'Must be greater than 0' },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Original Price <span className="text-red-500">*</span>
                        </FormLabel>

                        <Input
                            type="number"
                            placeholder="299"
                            min={0}
                            step={0.01}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="discountPrice"
                rules={{
                    validate: (value) => {
                        if (!value) return true;

                        return value <= getValues('originalPrice') ? true : 'Discount must be less than original price';
                    },
                }}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Discount Price</FormLabel>

                        <Input
                            type="number"
                            placeholder="269"
                            min={0}
                            step={0.01}
                            value={field.value || ''}
                            onChange={(e) => field.onChange(e.target.value === '' ? null : Number(e.target.value))}
                        />

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="percentageOff"
                render={() => (
                    <FormItem>
                        <FormLabel>Percentage Off</FormLabel>

                        <Input
                            readOnly
                            value={percent}
                            placeholder="Auto-calculated"
                            className="bg-gray-50 text-gray-600"
                        />
                    </FormItem>
                )}
            />
        </div>
    );
}
