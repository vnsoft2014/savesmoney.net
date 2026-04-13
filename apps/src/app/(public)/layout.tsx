import DealPopup from '@/components/widgets/DealPopup';
import { Footer, Header } from '@/features/public/layout';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <DealPopup />
        </>
    );
}
