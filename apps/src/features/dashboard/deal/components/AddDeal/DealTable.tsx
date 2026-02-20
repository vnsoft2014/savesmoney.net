import { DealFormValues } from '@/shared/types';
import DealRow from './DealRow';

type Props = {
    deals: DealFormValues[];
    onAddDeal: () => void;
    onSave: () => void;
};

export default function DealTable({ deals }: Props) {
    return (
        <table className="w-full border-collapse">
            <thead>
                <tr className="bg-gray-100 border-b-2 border-gray-300">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-16">No.</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Picture</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-60">Deal Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">Deal Store</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-40">Exp. Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">Short Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">Purchase Link</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-32">Description</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 w-48">More</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 w-20">Action</th>
                </tr>
            </thead>
            <tbody>
                {deals.map((deal, index) => (
                    <DealRow key={deal.id} deal={deal} index={index} />
                ))}
            </tbody>
        </table>
    );
}
