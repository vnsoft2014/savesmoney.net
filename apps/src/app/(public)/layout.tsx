import { Footer, Header } from '@/features/public/layout';
import ChatWidget from '@/shared/components/widgets/ChatWidget';
import DealPopup from '@/shared/components/widgets/DealPopup';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Header />
            <main>{children}</main>
            <Footer />
            <ChatWidget />
            <DealPopup />
        </>
    );
}
