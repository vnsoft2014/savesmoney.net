import { SITE } from '@/config/site';
import SignUpForm from '@/features/auth/signup/SignUpForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Sign Up | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/signup`,
    },
};

const Page = () => {
    return <SignUpForm />;
};

export default Page;
