import { SITE } from '@/config/site';
import SignInForm from '@/features/auth/signin/SignInForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Sign In | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/signin`,
    },
};

const Page = () => {
    return <SignInForm />;
};

export default Page;
