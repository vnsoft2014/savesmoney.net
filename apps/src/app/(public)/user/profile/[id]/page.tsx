import UserProfile from '@/features/public/user/UserProfile';
import { getUserById } from '@/services/admin/user';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: `User Profile | ${SITE.name}`,
};

interface PageProps {
    params: {
        id: string;
    };
}

const Page = async ({ params }: PageProps) => {
    const { id } = await params;

    const data = await getUserById(id);

    if (!data.success) {
        notFound();
    }

    return <UserProfile user={data.data} />;
};

export default Page;
