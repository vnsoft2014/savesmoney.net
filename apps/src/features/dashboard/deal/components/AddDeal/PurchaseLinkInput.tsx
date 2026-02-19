import { DealFormValues } from '@/shared/types';
import { useDealContext } from '../../contexts';
import { debounceCheckDuplicate } from '../../utils';

type Props = {
    deal: DealFormValues;
};

export default function PurchaseLinkInput({ deal }: Props) {
    const { updateDeal, checkingDuplicate, setCheckingDuplicate, errors, setErrors } = useDealContext();

    return (
        <td className="px-4 py-3">
            <div className="purchase-link">
                <div className="relative">
                    <input
                        type="text"
                        value={deal.purchaseLink}
                        onChange={(e) => {
                            const value = e.target.value;

                            updateDeal(deal.id, 'purchaseLink', value);

                            debounceCheckDuplicate(
                                deal.id,
                                {
                                    purchaseLink: value,
                                },
                                setErrors,
                                setCheckingDuplicate,
                            );
                        }}
                        placeholder="Purchase link"
                        className={`w-full pr-9 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                            errors[deal.id]?.purchaseLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />

                    {checkingDuplicate[deal.id]?.purchaseLink && (
                        <span className="absolute inset-y-0 right-2 flex items-center">
                            <svg className="animate-spin h-4 w-4 text-gray-500" viewBox="0 0 24 24" fill="none">
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                />
                            </svg>
                        </span>
                    )}
                </div>

                {errors[deal.id]?.purchaseLink && (
                    <span className="text-xs text-red-500 block mt-1">{errors[deal.id]?.purchaseLink}</span>
                )}
            </div>
        </td>
    );
}
