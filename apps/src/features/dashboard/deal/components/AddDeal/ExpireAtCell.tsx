import { DealFormValues } from '@/shared/types';
import { useEffect } from 'react';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error?: string;
};

export default function ExpireAtCell({ deal, error }: Props) {
    const { updateDeal } = useDealContext();
    const isDisableExpireAt = deal.disableExpireAt || deal.coupon || deal.clearance;

    useEffect(() => {
        if (isDisableExpireAt) {
            updateDeal(deal.id, 'expireAt', null);
        }
    }, [isDisableExpireAt, updateDeal]);

    return (
        <td className="px-4 py-3">
            <div className="flex items-center gap-1">
                <input
                    type="date"
                    value={deal.expireAt || ''}
                    onChange={(e) => updateDeal(deal.id, 'expireAt', e.target.value)}
                    className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                        error ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={isDisableExpireAt}
                />

                <input
                    type="checkbox"
                    checked={deal.disableExpireAt}
                    onChange={(e) => updateDeal(deal.id, 'disableExpireAt', e.target.checked)}
                    disabled={deal.coupon || deal.clearance}
                    className="w-5 h-5 accent-green-600"
                />
            </div>
            {error && <span className="text-xs text-red-500 block mt-1">{error}</span>}
        </td>
    );
}
