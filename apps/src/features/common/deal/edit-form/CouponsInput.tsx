'use client';

import { Plus, Trash2 } from 'lucide-react';
import { useController, useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/shared/shadecn/ui/button';
import { Card, CardContent } from '@/shared/shadecn/ui/card';
import { Field, FieldError, FieldLabel } from '@/shared/shadecn/ui/field';
import { Input } from '@/shared/shadecn/ui/input';

export default function CouponsInput() {
    const { control } = useFormContext();

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'coupons',
    });

    return (
        <div className="space-y-4">
            <Field className="gap-2">
                <FieldLabel className="text-gray-700">Coupons</FieldLabel>
            </Field>

            {fields.map((item, index) => (
                <CouponRow key={item.id} index={index} remove={remove} control={control} />
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
    );
}

type CouponRowProps = {
    index: number;
    remove: (index: number) => void;
    control: any;
};

function CouponRow({ index, remove, control }: CouponRowProps) {
    const { field: codeField, fieldState: codeState } = useController({
        name: `coupons.${index}.code`,
        control,
    });

    const { field: commentField, fieldState: commentState } = useController({
        name: `coupons.${index}.comment`,
        control,
    });

    return (
        <Card>
            <CardContent className="pt-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {/* Code */}
                    <Field data-invalid={codeState.invalid} className="gap-2">
                        <FieldLabel className="text-gray-700">Code</FieldLabel>
                        <Input placeholder="Coupon code" {...codeField} aria-invalid={codeState.invalid} />
                        {codeState.invalid && <FieldError errors={[codeState.error]} />}
                    </Field>

                    {/* Comment */}
                    <Field data-invalid={commentState.invalid} className="gap-2">
                        <FieldLabel className="text-gray-700">Comment</FieldLabel>
                        <Input placeholder="Comment" {...commentField} aria-invalid={commentState.invalid} />
                        {commentState.invalid && <FieldError errors={[commentState.error]} />}
                    </Field>
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
    );
}
