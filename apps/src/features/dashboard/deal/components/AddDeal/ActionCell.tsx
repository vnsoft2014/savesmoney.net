import { Trash2 } from 'lucide-react';
import { useDealContext } from '../../contexts';

type Props = {
    dealId: number;
};

export default function ActionCell({ dealId }: Props) {
    const { deleteRow } = useDealContext();

    return (
        <td className="px-4 py-3 text-center">
            <button
                onClick={() => deleteRow(dealId)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-colors"
                title="Delete deal"
            >
                <Trash2 size={18} />
            </button>
        </td>
    );
}
