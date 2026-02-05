import SignInForm from '@/features/auth/signin/SignInForm';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Sign In | ${SITE.name}`,
};

const Page = () => {
    return <SignInForm />;
};

export default Page;
