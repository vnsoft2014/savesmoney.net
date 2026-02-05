import { DealFormValues } from '@/shared/types';
import Select from 'react-select';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error?: string;
};

export default function DealTypeSelect({ deal, error }: Props) {
    const { loadingMeta, dealTypes, updateDeal } = useDealContext();

    return (
        <td className="px-4 py-3">
            <Select
                isMulti
                menuPortalTarget={typeof window !== 'undefined' ? document.body : null}
                menuPosition="fixed"
                menuPlacement="auto"
                isLoading={loadingMeta}
                isDisabled={loadingMeta}
                placeholder="Select deal type"
                className="text-sm"
                classNamePrefix="react-select"
                options={dealTypes.map((type) => ({
                    value: type._id,
                    label: type.name,
                }))}
                value={dealTypes
                    .filter((type) => deal.dealType.includes(type._id))
                    .map((type) => ({
                        value: type._id,
                        label: type.name,
                    }))}
                onChange={(selectedOptions) =>
                    updateDeal(
                        deal.id,
                        'dealType',
                        selectedOptions.map((opt) => opt.value),
                    )
                }
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
