import { Button } from '@/shared/shadecn/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/shared/shadecn/ui/dialog';
import { DealFull } from '@/shared/types';

type DealStatus = 'pending' | 'rejected' | 'published';

interface DealStatusDialogProps {
    deal: DealFull | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusConfig: Record<
    Exclude<DealStatus, 'published'>,
    {
        title: string;
        description: string;
    }
> = {
    pending: {
        title: 'Deal is Pending',
        description:
            'This deal is still in pending. It will be available online after being verified and approved by Admin team.',
    },
    rejected: {
        title: 'Deal was Rejected',
        description: 'This deal was rejected.',
    },
};

export default function DealStatusDialog({ deal, open, onOpenChange }: DealStatusDialogProps) {
    if (!deal) return null;

    const config = deal.status !== 'published' ? statusConfig[deal.status as 'pending' | 'rejected'] : null;

    if (!config) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{config.title}</DialogTitle>
                    <DialogDescription>{config.description}</DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
