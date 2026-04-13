import { SITE } from '@/config/site';
import { DashboardLayoutClient } from '@/features/dashboard/layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Dashboard | ${SITE.name}`,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
