import { countView, getDealStats } from '@/services';
import { Eye, MessageCircle } from 'lucide-react';
import DealLike from './components/DealLike';
import DealShare from './components/DealShare';

interface DealStatsProps {
    dealId: string;
}

const DealStats = async ({ dealId }: DealStatsProps) => {
    await countView(dealId);
    const { views, likes, comments, likedBy } = await getDealStats(dealId);

    return (
        <div className="flex items-center gap-4 mt-2 lg:mt-5 text-sm md:text-[15px] text-gray-600">
            <DealLike dealId={dealId} initialLikes={likes} likedBy={likedBy} />

            <div className="flex items-center gap-1">
                <MessageCircle className="w-4.5 h-4.5 md:w-5.5 md:h-5.5 text-blue-600" />
                {comments} <span className="hidden md:inline-block">Comments</span>
            </div>

            <div className="flex items-center gap-1">
                <Eye className="w-4.5 h-4.5 md:w-5.5 md:h-5.5" />
                {views} <span className="hidden md:inline-block">Views</span>
            </div>

            <DealShare />
        </div>
    );
};

export default DealStats;
