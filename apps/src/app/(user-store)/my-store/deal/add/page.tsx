'use client';

import 'react-quill-new/dist/quill.snow.css';

import { AddDeal } from '@/features/public/my-store/deal';
import { MyStoreShell } from '@/features/public/my-store/overview';

export default function Page() {
    return (
        <MyStoreShell title="Add Deal">
            <AddDeal />
        </MyStoreShell>
    );
}
