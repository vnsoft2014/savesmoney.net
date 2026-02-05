import EditDealTypeForm from '@/features/dashboard/deal-type/EditDealTypeForm';
import { getDealTypeById } from '@/services/admin/deal-type';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const data = await getDealTypeById(id);

    if (!data.success) {
        notFound();
    }

    return <EditDealTypeForm dealType={data.data} />;
}
