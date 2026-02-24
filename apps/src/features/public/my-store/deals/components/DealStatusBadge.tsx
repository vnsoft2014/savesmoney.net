import { Badge } from '@/shared/shadecn/ui/badge';

type DealStatus = 'published' | 'pending' | 'rejected';

interface DealStatusBadgeProps {
    status: DealStatus;
}

const statusConfig: Record<DealStatus, { label: string; className: string }> = {
    published: {
        label: 'Published',
        className: 'bg-green-100 text-green-700',
    },
    pending: {
        label: 'Pending',
        className: 'bg-yellow-100 text-yellow-700',
    },
    rejected: {
        label: 'Rejected',
        className: 'bg-red-100 text-red-700',
    },
};

export default function DealStatusBadge({ status }: DealStatusBadgeProps) {
    const config = statusConfig[status];

    if (!config) return null;

    return (
        <Badge className={`text-[11px] md:text-xs ${config.className} hover:${config.className}`}>{config.label}</Badge>
    );
}
