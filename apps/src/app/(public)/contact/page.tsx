import type { Metadata } from 'next';

import Contact2 from '@/shared/components/widgets/Contact2';
import { SITE } from '@/utils/site';

export const metadata: Metadata = {
    title: `Contact Us | ${SITE.name}`,
};

const Page = () => {
    return (
        <>
            <Contact2 />
        </>
    );
};

export default Page;
