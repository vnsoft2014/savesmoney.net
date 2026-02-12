import { Checkbox } from '@/shared/shadecn/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

export default function FlashDealInput() {
    const { control, setValue } = useFormContext();

    const isFlashDeal = useWatch({
        control,
        name: 'flashDeal',
    });

    useEffect(() => {
        if (!isFlashDeal) {
            setValue('flashDealExpireHours', null, {
                shouldDirty: true,
                shouldValidate: true,
            });
        }
    }, [isFlashDeal, setValue]);

    return (
        <div className="space-y-4">
            <FormField
                control={control}
                name="flashDeal"
                render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                        <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel>Flash Deal</FormLabel>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={control}
                name="flashDealExpireHours"
                render={({ field }) => {
                    const { value, ...rest } = field;

                    return (
                        <FormItem>
                            <FormLabel>Time</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    step={1}
                                    disabled={!isFlashDeal}
                                    value={field.value ?? ''}
                                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                    placeholder="24"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    );
                }}
            />
        </div>
    );
}
