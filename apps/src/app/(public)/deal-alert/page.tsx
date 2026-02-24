import { DealAlert } from '@/features/public/deal-alert';
import { SITE } from '@/utils/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Deal Alert | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/deal-alert`,
    },
};

const Page = () => {
    return <DealAlert />;
};

export default Page;
