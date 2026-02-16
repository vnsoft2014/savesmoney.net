import { MyStore, MyStoreShell } from '@/features/public/my-store/overview';

export default function Page() {
    return (
        <MyStoreShell title="My Store">
            <MyStore />
        </MyStoreShell>
    );
}
