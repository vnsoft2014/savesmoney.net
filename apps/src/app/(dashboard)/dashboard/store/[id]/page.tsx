import EditStoreForm from '@/features/dashboard/store/EditStoreForm';
import { getStoreById } from '@/services/admin/store';
import { notFound } from 'next/navigation';

interface PageProps {
    params: {
        id: string;
    };
}

export default async function EditStorePage({ params }: PageProps) {
    const { id } = await params;

    const data = await getStoreById(id);

    if (!data.success) {
        notFound();
    }

    return <EditStoreForm store={data.data} />;
}
