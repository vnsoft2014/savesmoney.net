import SignUpForm from '@/features/auth/signup/SignUpForm';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Sign Up | ${SITE.name}`,
};

const Page = () => {
    return <SignUpForm />;
};

export default Page;
