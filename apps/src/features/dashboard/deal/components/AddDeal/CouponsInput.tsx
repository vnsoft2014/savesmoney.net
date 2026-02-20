'use client';

import { Coupon, DealFormValues } from '@/shared/types';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error?: string;
};

export default function CouponsInput({ deal, error }: Props) {
    const { updateDeal } = useDealContext();

    const coupons: Coupon[] = Array.isArray(deal.coupons) ? deal.coupons : [];

    const handleAdd = () => {
        const newCoupons = [...coupons, { code: '', comment: '' }];
        updateDeal(deal.id, 'coupons', newCoupons);
    };

    const handleRemove = (index: number) => {
        const newCoupons = coupons.filter((_, i) => i !== index);

        updateDeal(deal.id, 'coupons', newCoupons);
    };

    const handleChange = (index: number, field: keyof Coupon, value: string) => {
        const newCoupons = [...coupons];
        newCoupons[index] = {
            ...newCoupons[index],
            [field]: value,
        };

        updateDeal(deal.id, 'coupons', newCoupons);
    };

    return (
        <>
            <div className="space-y-3">
                {coupons?.map((coupon, index) => (
                    <div key={index} className="rounded-lg border border-gray-200 p-3 space-y-2 bg-white">
                        <input
                            type="text"
                            placeholder="Coupon code"
                            value={coupon.code}
                            onChange={(e) => handleChange(index, 'code', e.target.value)}
                            className="w-full rounded-md border px-2 py-1 text-sm"
                        />

                        <input
                            type="text"
                            placeholder="Comment"
                            value={coupon.comment}
                            onChange={(e) => handleChange(index, 'comment', e.target.value)}
                            className="w-full rounded-md border px-2 py-1 text-sm"
                        />

                        <button
                            type="button"
                            onClick={() => handleRemove(index)}
                            className="text-xs text-red-500 hover:underline"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {coupons.length === 0 && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        + Add Coupon
                    </button>
                )}

                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        </>
    );
}
