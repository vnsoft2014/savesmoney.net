import { StoreSettingsForm } from '@/features/public/my-store/settings';

export default async function SettingsPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-3 py-6">
            <div className="w-full max-w-xl mx-auto">
                <StoreSettingsForm />
            </div>
        </div>
    );
}
