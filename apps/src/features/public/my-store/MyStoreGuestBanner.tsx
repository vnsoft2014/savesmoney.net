'use client';

import Link from 'next/link';

export default function MyStoreGuestBanner() {
    return (
        <div className="relative min-h-[80vh] p-6 sm:p-8 z-10 flex flex-col items-center justify-center gap-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">You haven’t posted any deals yet</h3>

            <p className="text-center text-sm sm:text-base max-w-xl">
                You can earn credits by posting deals and customers buy products through your links. To post deals, you
                need to create an account by signing up{' '}
                <Link href={'/signup'} className="underline hover:text-blue-600 transition-colors" prefetch={false}>
                    here
                </Link>
                .
            </p>

            <div className="shrink-0">
                <Link
                    href="/signup"
                    className="inline-flex items-center justify-center
                                   px-6 py-3
                                   bg-indigo-600 text-white
                                   font-semibold rounded-xl
                                   shadow-md
                                   transition-colors
                                   hover:bg-indigo-700
                                   active:scale-95"
                >
                    Create Account
                </Link>
            </div>
        </div>
    );
}
