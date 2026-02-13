import { EditDealForm } from '@/features/public/my-store/deal';
import { getDealById } from '@/services';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const deal = await getDealById(id);

    if (!deal) {
        notFound();
    }

    return <EditDealForm deal={deal} />;
}
