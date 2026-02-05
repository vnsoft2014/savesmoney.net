'use client';

import { AlertCircle } from 'lucide-react';

interface Props {
    reset: () => void;
}

export default function Error({ reset }: Props) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">
                <AlertCircle size={120} className="text-destructive" />
            </div>

            <h2 className="mb-2 text-2xl font-extrabold tracking-tight text-gray-900">Something went wrong</h2>

            <div className="flex gap-4 mt-6">
                <button
                    onClick={() => window.location.reload()}
                    className="min-w-32 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Reload page
                </button>

                <button
                    onClick={reset}
                    className="min-w-32 rounded-lg bg-primary hover:bg-primary/90 px-5 py-2.5 text-sm font-medium text-white transition-all active:scale-95"
                >
                    Try again
                </button>
            </div>
        </div>
    );
}
