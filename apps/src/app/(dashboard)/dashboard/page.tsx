import AdminNavbar from '@/features/dashboard/layout/AdminNavbar';
import AdminSidebar from '@/features/dashboard/layout/AdminSidebar';
import SuperComponent from '@/features/dashboard/layout/SuperComponent';
import { SITE } from '@/utils/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: `Dashboard | ${SITE.name}`,
};

const Page = () => {
    return (
        <div className="w-full h-screen flex bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="w-full h-full">
                <AdminNavbar />
                <div className="w-full h-5/6 flex flex-wrap items-start justify-center overflow-y-auto px-4 py-2">
                    <SuperComponent />
                </div>
            </div>
        </div>
    );
};

export default Page;
