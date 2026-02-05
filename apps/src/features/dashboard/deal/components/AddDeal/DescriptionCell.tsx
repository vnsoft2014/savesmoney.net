import { DealFormValues } from '@/shared/types';
import { stripHtmlTags } from '@/utils/utils';
import { Edit } from 'lucide-react';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
    error?: string;
};

export default function DescriptionCell({ deal, error }: Props) {
    const { openDescriptionEditor } = useDealContext();

    return (
        <td className="px-4 py-3">
            <div
                onClick={() => openDescriptionEditor(deal.id)}
                className={`w-full px-3 py-2 border rounded cursor-pointer hover:bg-gray-50 transition-colors text-sm min-h-15 flex items-center justify-between ${
                    error ? 'border-red-500' : 'border-gray-300'
                }`}
            >
                <span className={`flex-1 line-clamp-2 ${deal.description ? 'text-gray-700' : 'text-gray-400'}`}>
                    {deal.description ? stripHtmlTags(deal.description) : 'Click to add description...'}
                </span>
                <Edit size={16} className="text-gray-400 ml-2 shrink-0" />
            </div>
            {error && <span className="text-xs text-red-500 block mt-1">{error}</span>}
        </td>
    );
}
