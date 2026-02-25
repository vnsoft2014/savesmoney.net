import { DashboardLayoutClient } from '@/features/dashboard/layout';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Dashboard | ${SITE.name}`,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
