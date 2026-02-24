import ResetPasswordForm from '@/features/auth/reset-password/ResetPasswordForm';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Reset Password | ${SITE.name}`,
    alternates: {
        canonical: `${SITE.url}/reset-password`,
    },
};

const Page = () => {
    return <ResetPasswordForm />;
};

export default Page;
