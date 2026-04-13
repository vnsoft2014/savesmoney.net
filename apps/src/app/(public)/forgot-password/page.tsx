import { SITE } from '@/config/site';
import ForgotPasswordForm from '@/features/auth/forgot-password/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Forgot Password | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/forgot-password`,
    },
};

const Page = () => {
    return <ForgotPasswordForm />;
};

export default Page;
