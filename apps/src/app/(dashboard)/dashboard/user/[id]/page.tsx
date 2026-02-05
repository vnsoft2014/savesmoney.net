import { EditUserForm } from '@/features/dashboard/user/components';
import { getUserById } from '@/services/admin/user';
import { notFound } from 'next/navigation';

interface PageProps {
    params: { id: string };
}

export default async function Page({ params }: PageProps) {
    const { id } = await params;

    const data = await getUserById(id);

    if (!data.success) {
        notFound();
    }

    return <EditUserForm user={data.data} />;
}
