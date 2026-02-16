import { MyStoreShell } from '@/features/public/my-store/overview';
import { Settings } from '@/features/public/my-store/settings';

export default async function Page() {
    return (
        <MyStoreShell title="Store Settings">
            <Settings />
        </MyStoreShell>
    );
}
