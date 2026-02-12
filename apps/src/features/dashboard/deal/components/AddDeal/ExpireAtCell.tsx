import { DealFormValues } from '@/shared/types';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
};

export default function ExpireAtCell({ deal }: Props) {
    const { updateDeal, errors } = useDealContext();
    const isFlashDeal = deal.flashDeal;

    const isDisableExpireAt = deal.disableExpireAt || deal.coupon || deal.clearance;

    return (
        <td className="px-4 py-3">
            <div className="expire-at">
                <div className="flex items-center gap-1">
                    <input
                        type="date"
                        value={deal.expireAt ?? ''}
                        onChange={(e) => updateDeal(deal.id, 'expireAt', e.target.value)}
                        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            errors[deal.id]?.expireAt ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={isDisableExpireAt || isFlashDeal}
                    />

                    <input
                        type="checkbox"
                        checked={isDisableExpireAt}
                        onChange={(e) => {
                            const checked = e.target.checked;

                            updateDeal(deal.id, 'disableExpireAt', checked);

                            if (!checked) {
                                updateDeal(deal.id, 'expireAt', '');
                            }
                        }}
                        disabled={deal.coupon || deal.clearance || isFlashDeal}
                        className="w-5 h-5 accent-green-600"
                    />
                </div>
                {errors[deal.id]?.expireAt && (
                    <span className="text-xs text-red-500 block mt-1">{errors[deal.id]?.expireAt}</span>
                )}
            </div>

            <div className="mt-3">
                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={isFlashDeal}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            updateDeal(deal.id, 'flashDeal', !!checked);

                            if (!checked) {
                                updateDeal(deal.id, 'flashDealExpireHours', null);
                            }
                        }}
                    />
                    <span className="text-sm">Flash deal</span>
                </div>

                <input
                    type="number"
                    min={1}
                    step={1}
                    disabled={!isFlashDeal}
                    value={deal.flashDealExpireHours ?? ''}
                    onChange={(e) =>
                        updateDeal(deal.id, 'flashDealExpireHours', e.target.value ? Number(e.target.value) : null)
                    }
                    placeholder="24"
                    className={`w-full px-3 py-2 mt-3 border rounded text-sm border-gray-300
                    disabled:bg-gray-100 disabled:cursor-not-allowed ${
                        errors[deal.id]?.flashDealExpireHours ? 'border-red-500' : 'border-gray-300'
                    }`}
                />

                {errors[deal.id]?.flashDealExpireHours && (
                    <span className="text-xs text-red-500 block mt-1">{errors[deal.id]?.flashDealExpireHours}</span>
                )}
            </div>
        </td>
    );
}
