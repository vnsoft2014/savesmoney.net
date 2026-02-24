import { MyStore, MyStoreShell } from '@/features/public/my-store/overview';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `SavesMoney Stores | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/my-store`,
    },
};

export default function Page() {
    return (
        <MyStoreShell title="My Store">
            <MyStore />
        </MyStoreShell>
    );
}
