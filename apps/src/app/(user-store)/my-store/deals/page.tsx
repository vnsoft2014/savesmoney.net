'use client';

import Deals from '@/features/public/my-store/deals/Deals';
import { MyStoreShell } from '@/features/public/my-store/overview';

export default function Page() {
    return (
        <MyStoreShell title="All Deals">
            <Deals />
        </MyStoreShell>
    );
}
