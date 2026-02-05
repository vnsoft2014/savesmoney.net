import ForgotPasswordForm from '@/features/auth/forgot-password/ForgotPasswordForm';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Forgot Password | ${SITE.name}`,
};

const Page = () => {
    return <ForgotPasswordForm />;
};

export default Page;
