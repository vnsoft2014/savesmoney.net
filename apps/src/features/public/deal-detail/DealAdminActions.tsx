'use client';

import { touchDeal } from '@/features/common/deal/services';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/shared/shadecn/ui/button';
import { Pencil, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-toastify';

type Props = {
    dealId: string;
};

const DealAdminActions = ({ dealId }: Props) => {
    const { isAdmin } = useAuth();
    const [isRefreshing, setIsRefreshing] = useState(false);

    if (!isAdmin) return null;

    const handleRefresh = async () => {
        setIsRefreshing(true);
        const data = await touchDeal(dealId);

        if (data.success) {
            toast.success(data.message);
        } else {
            toast.error(data.message);
        }

        setIsRefreshing(false);
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={isRefreshing}
                title="Refresh deal"
                className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50 cursor-pointer"
            >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Link
                href={`/dashboard/deal/${dealId}?redirect=deal-detail`}
                title="Edit deal"
                className="inline-flex items-center justify-center h-8 w-8 rounded-md text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition-colors"
            >
                <Pencil className="w-4 h-4" />
            </Link>
        </div>
    );
};

export default DealAdminActions;
