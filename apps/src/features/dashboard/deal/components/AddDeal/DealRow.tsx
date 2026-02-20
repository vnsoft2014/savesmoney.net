import { DealFormValues } from '@/shared/types';
import { useDealContext } from '../../contexts';
import ActionCell from './ActionCell';
import CouponsInput from './CouponsInput';
import DealFlags from './DealFlags';
import DealTypeSelect from './DealTypeSelect';
import DescriptionCell from './DescriptionCell';
import ExpireAtCell from './ExpireAtCell';
import PictureUploadCell from './PictureUploadCell';
import PriceCell from './PriceCell';
import PurchaseLinkInput from './PurchaseLinkInput';
import ShortDescriptionInput from './ShortDescriptionInput';
import StoreSelect from './StoreSelect';

type Props = {
    deal: DealFormValues;
    index: number;
};

export default function DealRow({ deal, index }: Props) {
    const { errors } = useDealContext();

    return (
        <tr key={deal.id} className="border-b border-gray-200 hover:bg-gray-50">
            <td className="px-4 py-3 text-sm text-gray-700">{index + 1}</td>

            <PictureUploadCell deal={deal} error={errors[deal.id]?.picture} />

            <DealTypeSelect deal={deal} error={errors[deal.id]?.dealType} />

            <StoreSelect deal={deal} error={errors[deal.id]?.store} />

            <ExpireAtCell deal={deal} />

            <ShortDescriptionInput deal={deal} error={errors[deal.id]?.shortDescription} />

            <PriceCell deal={deal} />

            <PurchaseLinkInput deal={deal} />

            <td className="w-32 space-y-4 px-4 py-3">
                <DescriptionCell deal={deal} error={errors[deal.id]?.description} />
                <CouponsInput deal={deal} error={errors[deal.id]?.coupons} />
            </td>

            <DealFlags deal={deal} />

            <ActionCell dealId={deal.id} />
        </tr>
    );
}
