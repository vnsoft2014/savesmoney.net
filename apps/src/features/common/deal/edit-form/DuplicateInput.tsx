import { checkDuplicate } from '@/services/admin/deal';
import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { useRef } from 'react';
import { useFormContext } from 'react-hook-form';

export default function DuplicateInput({ name, label }: { name: 'shortDescription' | 'purchaseLink'; label: string }) {
    const { control, setError } = useFormContext();
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const debounceCheck = (value: string) => {
        if (timeout.current) clearTimeout(timeout.current);

        timeout.current = setTimeout(async () => {
            const res = await checkDuplicate(
                name === 'shortDescription' ? value : undefined,
                name === 'purchaseLink' ? value : undefined,
            );

            if (res?.isDuplicate) {
                setError(name, { message: `${label} already exists` });
            }
        }, 500);
    };

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label} *</FormLabel>
                    <Input
                        {...field}
                        onChange={(e) => {
                            field.onChange(e.target.value);
                            debounceCheck(e.target.value);
                        }}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
