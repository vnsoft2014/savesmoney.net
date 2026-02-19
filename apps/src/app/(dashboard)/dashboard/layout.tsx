import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Dashboard | ${SITE.name}`,
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <main className="min-h-screen bg-gray-100">{children}</main>;
}
