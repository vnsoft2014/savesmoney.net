import { EditDeal } from '@/features/public/my-store/deal';
import { MyStoreShell } from '@/features/public/my-store/overview';
import { getDealById } from '@/services';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ id: string }>;
}

export default async function Page({ params }: Props) {
    const { id } = await params;

    const deal = await getDealById(id);

    if (!deal) return notFound();

    return (
        <MyStoreShell title="Edit Deal">
            <EditDeal deal={deal} />
        </MyStoreShell>
    );
}
