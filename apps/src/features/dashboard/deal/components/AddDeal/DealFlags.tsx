import { Badge } from '@/shared/shadecn/ui/badge';
import { DealFormValues } from '@/shared/types';
import { X } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';
import { useDealContext } from '../../contexts';

type Props = {
    deal: DealFormValues;
};

const FLAG_CONFIG = [
    { key: 'hotTrend', label: 'Trending Deals', color: 'accent-blue-600' },
    { key: 'holidayDeals', label: 'Holiday Deals', color: 'accent-green-600' },
    { key: 'seasonalDeals', label: 'Seasonal Deals', color: 'accent-green-600' },
    { key: 'coupon', label: 'Coupon', color: 'accent-purple-600' },
    { key: 'clearance', label: 'Clearance', color: 'accent-red-600' },
] as const;

export default function DealFlags({ deal }: Props) {
    const { updateDeal } = useDealContext();

    const [inputValue, setInputValue] = useState('');

    const tags = Array.isArray(deal.tags) ? deal.tags : [];

    const addTag = (value: string) => {
        const newTag = value.trim();
        if (!newTag) return;

        if (!tags.includes(newTag)) {
            const newTagsArray = [...tags, newTag];
            updateDeal(deal.id, 'tags', newTagsArray);
        }
        setInputValue('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === ',' || e.key === ';') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const removeTag = (tagToRemove: string) => {
        updateDeal(
            deal.id,
            'tags',
            tags.filter((tag) => tag !== tagToRemove),
        );
    };

    return (
        <td className="px-4 py-3 text-center">
            <div className="space-y-3">
                {FLAG_CONFIG.map(({ key, label, color }) => (
                    <div key={key} className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{label}</span>
                        <input
                            type="checkbox"
                            checked={!!deal[key]}
                            onChange={(e) => updateDeal(deal.id, key, e.target.checked)}
                            className={`w-5 h-5 ${color}`}
                        />
                    </div>
                ))}

                <div className="tags">
                    <div className="text-left">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tags</label>

                        <input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Enter tag and press Enter"
                            className="w-full mt-4 pr-9 px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm border-gray-300"
                        />
                    </div>

                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => removeTag(tag)}
                                        className="ml-1 rounded hover:bg-black/10"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </td>
    );
}
