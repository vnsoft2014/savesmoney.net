import { DealFormValues } from '@/shared/types';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
};

export default function PriceCell({ deal }: Props) {
    const { updateDeal, errors } = useDealContext();

    return (
        <>
            <td className="px-4 py-3">
                <div>
                    <input
                        type="number"
                        value={deal.originalPrice || ''}
                        onChange={(e) => updateDeal(deal.id, 'originalPrice', Number(e.target.value))}
                        placeholder="Org. Price"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            errors[deal.id]?.originalPrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors[deal.id]?.originalPrice && (
                        <span className="text-xs text-red-500 block mt-1">{errors[deal.id].originalPrice}</span>
                    )}
                </div>

                <div className="mt-3">
                    <input
                        type="number"
                        value={deal.discountPrice || ''}
                        onChange={(e) => updateDeal(deal.id, 'discountPrice', Number(e.target.value))}
                        placeholder="Dis. Price"
                        min="0"
                        step="0.01"
                        className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            errors[deal.id]?.discountPrice ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors[deal.id]?.discountPrice && (
                        <span className="text-xs text-red-500 block mt-1">{errors[deal.id].discountPrice}</span>
                    )}
                </div>

                <div className="mt-3">
                    <input
                        type="text"
                        value={deal.percentageOff}
                        readOnly
                        placeholder="% Off"
                        className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm text-gray-600"
                    />
                </div>
            </td>
        </>
    );
}
