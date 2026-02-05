// comments/CommentHeader.tsx
import { Button } from '@/shared/shadecn/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/shadecn/ui/select';

type Props = {
    count: number;
    sortBy: 'newest' | 'oldest' | 'popular';
    onSortChange: (value: 'newest' | 'oldest' | 'popular') => void;
    showComments: boolean;
    onToggle: () => void;
};

export default function CommentHeader({ count, sortBy, onSortChange, showComments, onToggle }: Props) {
    return (
        <div className="flex flex-row items-center justify-between gap-4 border-b pb-4">
            <h3 className="mb-0! text-base md:text-xl font-semibold tracking-tight">{count} Comments</h3>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={onToggle}>
                    {showComments ? 'Hide' : 'Show'}
                </Button>

                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger className="w-35 h-9 text-xs">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}
