import { FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';
import { useFormContext } from 'react-hook-form';

export default function DuplicateInput({ name, label }: { name: 'shortDescription' | 'purchaseLink'; label: string }) {
    const { control } = useFormContext();

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
                        }}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
