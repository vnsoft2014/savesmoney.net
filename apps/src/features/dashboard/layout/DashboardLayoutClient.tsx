'use client';

import { useAuth } from '@/hooks/useAuth';
import { useIdleLogout } from '@/hooks/useIdleLogout';
import { AutoLogoutWarning } from '@/shared/components/widgets';

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
    const { logout } = useAuth();

    const { showPopup, stayLoggedIn, logoutNow } = useIdleLogout(() => {
        logout();
    }, true);

    return (
        <>
            {showPopup && <AutoLogoutWarning onStayActive={stayLoggedIn} onLogout={logoutNow} />}

            <main className="min-h-screen bg-gray-100">{children}</main>
        </>
    );
}
