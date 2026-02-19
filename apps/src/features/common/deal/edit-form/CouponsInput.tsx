'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/shadecn/ui/form';
import { Input } from '@/shared/shadecn/ui/input';

export default function CouponsInput() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'coupons',
    });

    return (
        <FormField
            control={control}
            name="coupons"
            render={() => (
                <FormItem>
                    <FormLabel>Coupons</FormLabel>

                    <FormControl>
                        <div className="space-y-4">
                            {fields.map((field, index) => (
                                <Card key={field.id}>
                                    <CardContent className="pt-4 space-y-3">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            <FormField
                                                control={control}
                                                name={`coupons.${index}.code`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Coupon code" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={control}
                                                name={`coupons.${index}.comment`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Comment</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Comment" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="flex justify-end">
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                className="text-white"
                                                onClick={() => remove(index)}
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {fields.length === 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        append({
                                            code: '',
                                            comment: '',
                                        })
                                    }
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Coupon
                                </Button>
                            )}
                        </div>
                    </FormControl>

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
