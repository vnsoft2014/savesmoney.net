import { DealFormValues } from '@/shared/types';
import Select from 'react-select';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error?: string;
};

export default function StoreSelect({ deal, error }: Props) {
    const { loadingMeta, stores, updateDeal } = useDealContext();

    return (
        <td className="px-4 py-3">
            <Select
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                isLoading={loadingMeta}
                isDisabled={loadingMeta}
                placeholder="Select store"
                className="text-sm"
                classNamePrefix="react-select"
                options={stores.map((store) => ({
                    value: store._id,
                    label: store.name,
                }))}
                value={
                    stores
                        .filter((store) => store._id === deal.store)
                        .map((store) => ({
                            value: store._id,
                            label: store.name,
                        }))[0] || null
                }
                onChange={(selected) => updateDeal(deal.id, 'store', selected?.value || '')}
                styles={{
                    control: (base, state) => ({
                        ...base,
                        minHeight: '38px',
                        borderColor: error ? '#ef4444' : state.isFocused ? '#3b82f6' : base.borderColor,
                        boxShadow: 'none',
                        '&:hover': {
                            borderColor: '#3b82f6',
                        },
                    }),
                }}
            />

            {error && <span className="text-xs text-red-500 block mt-1">{error}</span>}
        </td>
    );
}
